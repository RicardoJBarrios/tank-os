import {
  computed,
  signal,
  type Signal,
  type WritableSignal,
} from '@angular/core';
import type { AuthSessionPort } from '@tankos/authn';
import { authorizationSubjectFromPrincipal } from '@tankos/authz';
import { createFeedbackService, type FeedbackService } from '@tankos/feedback';
import { createNoopLogger, type Logger } from '@tankos/observability';
import {
  createCrudListStore,
  type CrudListService,
  type CrudListStoreInstance,
} from '@tankos/data-access-angular';
import type {
  CrudListLifecycleRequest,
  CrudOperationResult,
} from '@tankos/data-access-angular';
import type {
  UnitDefinition,
  UnitDefinitionManagementService,
  UnitDefinitionRecord,
} from '@tankos/units';
import { filterUnitDefinitionItems } from './unit-definition-list-filter';

const UNIT_DEFINITION_PAGE = {
  pageSize: 50,
  orderBy: [{ field: 'data.code', direction: 'asc' as const }],
};

export type UnitDefinitionListStore = Omit<
  CrudListStoreInstance<UnitDefinition, unknown>,
  'load' | 'loadMore' | 'markForDeletion' | 'restore'
> & {
  readonly load: (filter?: unknown) => Promise<void>;
  readonly loadMore: () => Promise<void>;
};

export interface UnitDefinitionListStoreParts {
  readonly list: UnitDefinitionListStore;
  readonly lifecycle: Pick<
    CrudListStoreInstance<UnitDefinition, unknown>,
    'markForDeletion' | 'restore'
  >;
}

export function createUnitDefinitionListStore(
  service: UnitDefinitionManagementService,
  authSession: AuthSessionPort,
  logger: Logger = createNoopLogger(),
  feedback: FeedbackService = createFeedbackService(),
): UnitDefinitionListStoreParts {
  const rawList = createRawUnitDefinitionList(service, authSession, logger);
  const list = createUnitDefinitionListView(rawList, feedback);
  return {
    list,
    lifecycle: {
      markForDeletion: (
        request: CrudListLifecycleRequest,
      ): Promise<CrudOperationResult> => rawList.markForDeletion(request),
      restore: (
        request: CrudListLifecycleRequest,
      ): Promise<CrudOperationResult> => rawList.restore(request),
    },
  };
}

function createRawUnitDefinitionList(
  service: UnitDefinitionManagementService,
  authSession: AuthSessionPort,
  logger: Logger,
): CrudListStoreInstance<UnitDefinition, unknown> {
  return new (createCrudListStore<UnitDefinition, unknown>({
    service: createAuthorizedListAdapter(service, authSession),
    logger,
    page: UNIT_DEFINITION_PAGE,
    lifecycle: (filter) =>
      isDeletedUnitFilter(filter)
        ? ['marked-for-deletion']
        : ['active', 'inactive'],
  }))();
}

function createUnitDefinitionListView(
  rawList: CrudListStoreInstance<UnitDefinition, unknown>,
  feedback: FeedbackService,
): UnitDefinitionListStore {
  const accessError = signal<unknown>(undefined);
  let loadQueue = Promise.resolve();
  return {
    ...createUnitDefinitionListSignals(rawList, accessError),
    load: (filter) => {
      loadQueue = enqueueListLoad(loadQueue, () =>
        loadUnitDefinitionList(rawList, feedback, accessError, filter),
      );
      return loadQueue;
    },
    loadMore: () => loadMoreUnitDefinitionList(rawList, feedback, accessError),
  };
}

async function loadUnitDefinitionList(
  rawList: CrudListStoreInstance<UnitDefinition, unknown>,
  feedback: FeedbackService,
  accessError: WritableSignal<unknown>,
  filter?: unknown,
): Promise<void> {
  accessError.set(undefined);
  await rawList
    .load(filter)
    .then((result) => {
      if (!result.ok) throw result.error;
    })
    .catch((error: unknown) => {
      accessError.set(error);
      feedback.error('Unable to load the units.');
    });
}

async function loadMoreUnitDefinitionList(
  rawList: CrudListStoreInstance<UnitDefinition, unknown>,
  feedback: FeedbackService,
  accessError: WritableSignal<unknown>,
): Promise<void> {
  accessError.set(undefined);
  try {
    const result = await rawList.loadMore();
    if (!result.ok) throw result.error;
  } catch (error) {
    accessError.set(error);
    feedback.error('Unable to load more units.');
  }
}

function createUnitDefinitionListSignals(
  rawList: CrudListStoreInstance<UnitDefinition, unknown>,
  accessError: Signal<unknown>,
): Omit<UnitDefinitionListStore, 'load' | 'loadMore'> {
  return {
    status: computed(() => (accessError() ? 'error' : rawList.status())),
    items: computed(() =>
      filterUnitDefinitionItems(rawList.items(), rawList.filter()),
    ),
    filter: rawList.filter,
    nextCursor: rawList.nextCursor,
    hasMore: rawList.hasMore,
    selectedIds: rawList.selectedIds,
    error: computed(() => accessError() ?? rawList.error()),
    isEmpty: rawList.isEmpty,
    canLoadMore: rawList.canLoadMore,
    setFilter: rawList.setFilter,
    toggleSelection: rawList.toggleSelection,
    clearSelection: rawList.clearSelection,
  };
}

function createAuthorizedListAdapter(
  service: UnitDefinitionManagementService,
  authSession: AuthSessionPort,
): CrudListService<UnitDefinition, unknown> {
  return {
    list: (request) =>
      resolveSubject(authSession).then((resolved) =>
        service.list({
          ...request,
          filter: request.filter as
            import('@tankos/units').UnitDefinitionFilter | undefined,
          subject: resolved,
        }),
      ),
    markForDeletion: (request) =>
      resolveSubject(authSession).then((resolved) =>
        service.markForDeletion({
          id: request.id,
          expectedRevision: request.expectedRevision,
          subject: resolved,
        }),
      ),
    restore: (request) =>
      resolveSubject(authSession).then((resolved) =>
        service.restore({
          id: request.id,
          expectedRevision: request.expectedRevision,
          subject: resolved,
        }),
      ),
  };
}

function resolveSubject(authSession: AuthSessionPort) {
  return authSession.principal().then(authorizationSubjectFromPrincipal);
}

function enqueueListLoad(
  queue: Promise<void>,
  load: () => Promise<void>,
): Promise<void> {
  return queue.then(load, load);
}

function isDeletedUnitFilter(filter: unknown): boolean {
  return (
    typeof filter === 'object' &&
    filter !== null &&
    'lifecycle' in filter &&
    filter.lifecycle === 'marked-for-deletion'
  );
}

/** Formats the stable identifier and its human-readable symbol for UI labels. */
export function formatUnitDefinitionLabel(
  record: UnitDefinitionRecord,
): string {
  return `${record.data.code} (${record.data.representation.symbol})`;
}
