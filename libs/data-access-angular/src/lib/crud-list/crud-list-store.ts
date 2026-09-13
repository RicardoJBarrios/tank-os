import { computed, type Type, type Signal } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import type { StateSignals, WritableStateSource } from '@ngrx/signals';
import type {
  CrudRecord,
  EntityId,
  LifecycleStatus,
  PageCursor,
} from '@tankos/data-access';
import { createNoopLogger } from '@tankos/observability';
import type {
  CrudOperationResult,
  CrudListStatus,
  CrudListState,
  CrudListStoreOptions,
} from './crud-list-contract';

/** Public instance surface returned by the CRUD list store factory. */
export interface CrudListStoreInstance<TData, TFilter> {
  readonly status: Signal<CrudListStatus>;
  readonly items: Signal<readonly CrudRecord<TData>[]>;
  readonly filter: Signal<TFilter | undefined>;
  readonly nextCursor: Signal<PageCursor | undefined>;
  readonly hasMore: Signal<boolean>;
  readonly selectedIds: Signal<readonly EntityId[]>;
  readonly error: Signal<unknown>;
  readonly isEmpty: Signal<boolean>;
  readonly canLoadMore: Signal<boolean>;
  readonly load: (filter?: TFilter) => Promise<CrudOperationResult>;
  readonly loadMore: () => Promise<CrudOperationResult>;
  readonly setFilter: (filter: TFilter | undefined) => void;
  readonly toggleSelection: (id: EntityId) => void;
  readonly clearSelection: () => void;
  readonly markForDeletion: (
    request: CrudListLifecycleRequest,
  ) => Promise<CrudOperationResult>;
  readonly restore: (
    request: CrudListLifecycleRequest,
  ) => Promise<CrudOperationResult>;
}

/** Request shared by the logical deletion and restoration commands. */
export interface CrudListLifecycleRequest {
  readonly metadata: import('@tankos/data-access').MutationMetadata;
  readonly id: EntityId;
  readonly expectedRevision: number;
}

type CrudListStoreSource<TData, TFilter> = StateSignals<
  CrudListState<TData, TFilter>
> &
  WritableStateSource<CrudListState<TData, TFilter>>;

function pageRequest<TData, TFilter>(
  options: CrudListStoreOptions<TData, TFilter>,
  after?: PageCursor,
) {
  return { ...options.page, ...(after ? { after } : {}) };
}

function resolveLifecycle<TFilter>(
  lifecycle:
    | readonly LifecycleStatus[]
    | ((filter: TFilter | undefined) => readonly LifecycleStatus[]),
  filter: TFilter | undefined,
) {
  if (typeof lifecycle === 'function') return lifecycle(filter);
  return lifecycle;
}

async function loadCrudList<TData, TFilter>(
  store: CrudListStoreSource<TData, TFilter>,
  options: CrudListStoreOptions<TData, TFilter>,
  filter?: TFilter,
  append = false,
): Promise<CrudOperationResult> {
  const logger = options.logger ?? createNoopLogger();
  logger.debug('CRUD list load started', { append });
  patchState(store, { status: 'loading', error: undefined });
  try {
    const page = await options.service.list({
      filter,
      page: pageRequest(options, append ? store.nextCursor() : undefined),
      ...(options.lifecycle
        ? {
            lifecycle: resolveLifecycle(options.lifecycle, filter),
          }
        : {}),
    });
    patchState(store, {
      status: 'ready',
      items: append ? [...store.items(), ...page.items] : page.items,
      filter,
      nextCursor: page.nextCursor,
      hasMore: page.hasMore,
    });
    logger.debug('CRUD list load completed', {
      append,
      itemCount: page.items.length,
      hasMore: page.hasMore,
    });
    return { ok: true, value: undefined };
  } catch (error) {
    logger.debug('CRUD list load failed', { append, error });
    patchState(store, { status: 'error', error });
    return { ok: false, error };
  }
}

async function reloadCrudList<TData, TFilter>(
  store: CrudListStoreSource<TData, TFilter>,
  options: CrudListStoreOptions<TData, TFilter>,
): Promise<void> {
  const result = await loadCrudList(store, options, store.filter());
  if (!result.ok) throw result.error;
}

function createCrudListLoadMethods<TData, TFilter>(
  store: CrudListStoreSource<TData, TFilter>,
  options: CrudListStoreOptions<TData, TFilter>,
) {
  return {
    load: (filter?: TFilter) => loadCrudList(store, options, filter),
    loadMore: (): Promise<CrudOperationResult> => {
      if (shouldSkipLoadMore(store))
        return Promise.resolve({ ok: true, value: undefined });
      return loadCrudList(store, options, store.filter(), true);
    },
  };
}

function shouldSkipLoadMore<TData, TFilter>(
  store: CrudListStoreSource<TData, TFilter>,
): boolean {
  return (
    !store.hasMore() || !store.nextCursor() || store.status() === 'loading'
  );
}

function createCrudListSelectionMethods<TData, TFilter>(
  store: CrudListStoreSource<TData, TFilter>,
) {
  return {
    toggleSelection: (id: EntityId) => {
      const selected = store.selectedIds();
      patchState(store, {
        selectedIds: selected.includes(id)
          ? selected.filter((selectedId) => selectedId !== id)
          : [...selected, id],
      });
    },
    clearSelection: () => {
      patchState(store, { selectedIds: [] });
    },
  };
}

function createCrudListLifecycleMethods<TData, TFilter>(
  store: CrudListStoreSource<TData, TFilter>,
  options: CrudListStoreOptions<TData, TFilter>,
) {
  return {
    markForDeletion: (
      request: CrudListLifecycleRequest,
    ): Promise<CrudOperationResult> => {
      const logger = options.logger ?? createNoopLogger();
      logger.debug('CRUD list deletion requested', { id: request.id });
      return runCrudOperation(store, async () => {
        await options.service.markForDeletion(request);
        await reloadCrudList(store, options);
      });
    },
    restore: (
      request: CrudListLifecycleRequest,
    ): Promise<CrudOperationResult> => {
      const logger = options.logger ?? createNoopLogger();
      logger.debug('CRUD list restoration requested', { id: request.id });
      return runCrudOperation(store, async () => {
        await options.service.restore(request);
        await reloadCrudList(store, options);
      });
    },
  };
}

async function runCrudOperation<TData, TFilter>(
  store: CrudListStoreSource<TData, TFilter>,
  operation: () => Promise<void>,
): Promise<CrudOperationResult> {
  patchState(store, { error: undefined });
  try {
    await operation();
  } catch (error) {
    patchState(store, { error });
    return { ok: false, error };
  }
  return { ok: true, value: undefined };
}

function createInitialState(): CrudListState<unknown, unknown> {
  return {
    status: 'idle',
    items: [],
    filter: undefined,
    nextCursor: undefined,
    hasMore: Boolean(0),
    /* c8 ignore next -- V8 maps the erased generic argument as a synthetic branch. */
    selectedIds: new Array<EntityId>(),
    /* c8 ignore next -- V8 reports the object-literal closing token as a synthetic branch. */
    error: undefined,
    /* c8 ignore next -- V8 maps the object-literal closing token as a synthetic branch. */
  };
}

/** Creates a Signal Store for the standard paginated CRUD list flow. */
export function createCrudListStore<TData, TFilter>(
  options: CrudListStoreOptions<TData, TFilter>,
  /* c8 ignore next */
): Type<CrudListStoreInstance<TData, TFilter>> {
  /* c8 ignore next 3 */
  return signalStore(
    withState(createInitialState() as CrudListState<TData, TFilter>),
    /* c8 ignore next 3 */
    withComputed((store) => ({
      isEmpty: computed(
        () => store.items().length === 0 && store.status() === 'ready',
      ),
      canLoadMore: computed(
        () => store.hasMore() && store.status() !== 'loading',
      ),
    })),
    withMethods((store) => ({
      ...createCrudListLoadMethods(store, options),
      setFilter: (filter: TFilter | undefined) => {
        patchState(store, { filter });
      },
      ...createCrudListSelectionMethods(store),
      ...createCrudListLifecycleMethods(store, options),
    })),
  );
}

/** Public signal shape used by headless CRUD views. */
export interface CrudListSignals<TData, TFilter> {
  readonly items: Signal<readonly CrudRecord<TData>[]>;
  readonly filter: Signal<TFilter | undefined>;
  readonly selectedIds: Signal<readonly EntityId[]>;
}
