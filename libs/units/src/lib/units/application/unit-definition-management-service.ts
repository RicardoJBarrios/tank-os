import type {
  CrudRecord,
  EntityId,
  LifecycleStatus,
  Page,
  VersionedCrudRepositoryPort,
} from '@tankos/data-access';
import {
  AUTHORIZATION_ROLES,
  AuthorizationDeniedError,
  type AuthorizationSubject,
} from '@tankos/authz';
import {
  createUnitCode,
  createUnitDefinition,
  createUnitRepresentation,
  UnitError,
  type UnitDefinition,
  type UnitDefinitionFilter,
} from '../core';
import type { UnitDefinitionRecord } from './unit-definition-record';
import type {
  CreateCustomUnitRequest,
  CustomUnitDefinitionDraft,
  GetUnitDefinitionRequest,
  ListUnitDefinitionsRequest,
  PublishUnitDefinitionRequest,
  ReplaceCustomUnitRequest,
  UnitDefinitionLifecycleRequest,
  UnitDefinitionManagementService,
} from './unit-definition-management-contract';
import {
  UNIT_DEFINITION_RESOURCE,
  unitDefinitionAuthorization,
  type UnitDefinitionAuthorizationAction,
} from './unit-definition-authorization-policy';

type UnitRepository = VersionedCrudRepositoryPort<
  UnitDefinition,
  UnitDefinition,
  UnitDefinition,
  UnitDefinitionFilter
>;

/** Authorizes catalogue use cases and invokes the repository directly. */
export function createUnitDefinitionManagementService(
  repository: UnitRepository,
): UnitDefinitionManagementService {
  return {
    list: (request) => runAsync(() => listUnitDefinitions(repository, request)),
    get: (request) => getUnitDefinition(repository, request),
    save: (request) => runAsync(() => saveUnitDefinition(repository, request)),
    publish: (request) =>
      runAsync(() => publishUnitDefinition(repository, request)),
    markForDeletion: (request) =>
      runLifecycle(repository, request, 'delete', (command) =>
        repository.markForDeletion(command),
      ),
    restore: (request) =>
      runLifecycle(repository, request, 'restore', (command) =>
        repository.restore(command),
      ),
    delete: (request) =>
      runLifecycle(repository, request, 'delete', (command) =>
        repository.delete(command),
      ),
  };
}

function listUnitDefinitions(
  repository: UnitRepository,
  request: ListUnitDefinitionsRequest,
): Promise<Page<UnitDefinitionRecord>> {
  requireUnitWorkspaceAccess(request.subject);
  if (
    request.lifecycle?.some(
      (status) => status === 'marked-for-deletion' || status === 'deleted',
    ) &&
    !request.subject.roles.includes(AUTHORIZATION_ROLES.ADMIN)
  ) {
    throw new AuthorizationDeniedError(
      'read-deleted',
      UNIT_DEFINITION_RESOURCE,
    );
  }
  const { subject, filter, ...technical } = request;
  return repository.list({
    ...technical,
    filter: {
      ...filter,
      ...(subject.roles.includes(AUTHORIZATION_ROLES.ADMIN)
        ? {}
        : { accessibleOwnerId: subject.id }),
    },
  });
}

async function getUnitDefinition(
  repository: UnitRepository,
  request: GetUnitDefinitionRequest,
): Promise<UnitDefinitionRecord | undefined> {
  const { subject, ...technical } = request;
  const record = await repository.get(technical);
  if (record) authorizeUnitRecord(subject, 'read', record);
  return record;
}

function saveUnitDefinition(
  repository: UnitRepository,
  request: CreateCustomUnitRequest | ReplaceCustomUnitRequest,
): Promise<UnitDefinitionRecord> {
  const ownerName = subjectDisplayName(request.subject);
  const definition =
    'current' in request
      ? replaceUnitDefinition(request.current, request.draft)
      : createCustomUnitDefinition(
          request.draft,
          request.subject.id,
          ownerName,
        );
  if ('id' in request) {
    authorizeUnitDefinition(request.subject, 'update', definition, request.id);
    return repository.replaceVersioned(
      {
        metadata: { actorId: request.subject.id },
        id: request.id,
        expectedRevision: request.expectedRevision,
      },
      definition,
    );
  }
  authorizeUnitDefinition(request.subject, 'create', definition);
  return repository.create({
    metadata: { actorId: request.subject.id },
    input: definition,
  });
}

function publishUnitDefinition(
  repository: UnitRepository,
  request: PublishUnitDefinitionRequest,
): Promise<UnitDefinitionRecord> {
  if (request.currentLifecycle !== 'active') {
    throw new UnitError(
      'UNIT_PUBLISH_INVALID_STATE',
      'Only an active unit definition can be published',
    );
  }
  authorizeUnitDefinition(
    request.subject,
    'publish',
    request.current,
    request.id,
  );
  const { code, system, representation, catalogueVersion } = request.current;
  return repository.replaceVersioned(
    {
      metadata: { actorId: request.subject.id },
      id: request.id,
      expectedRevision: request.expectedRevision,
    },
    createUnitDefinition({
      code,
      system,
      representation,
      catalogueVersion,
      visibility: 'public',
    }),
  );
}

function subjectDisplayName(subject: AuthorizationSubject): string | undefined {
  const displayName = subject.attributes?.['displayName'];
  return typeof displayName === 'string' ? displayName : undefined;
}

function runAsync<T>(operation: () => Promise<T>): Promise<T> {
  return Promise.resolve().then(operation);
}

async function runLifecycle<T>(
  repository: UnitRepository,
  request: UnitDefinitionLifecycleRequest,
  action: UnitDefinitionAuthorizationAction,
  operation: (command: {
    readonly metadata: { readonly actorId: string };
    readonly id: EntityId;
    readonly expectedRevision: number;
  }) => Promise<T>,
): Promise<T> {
  const record = await repository.get({
    id: request.id,
    lifecycle: ALL_LIFECYCLE,
  });
  if (!record)
    throw new UnitError('UNIT_NOT_FOUND', 'Unit definition not found');
  authorizeUnitRecord(request.subject, action, record);
  return operation({
    metadata: { actorId: request.subject.id },
    id: request.id,
    expectedRevision: request.expectedRevision,
  });
}

function authorizeUnitRecord(
  subject: AuthorizationSubject,
  action: UnitDefinitionAuthorizationAction,
  record: CrudRecord<UnitDefinition>,
): void {
  authorizeUnitDefinition(subject, action, record.data, record.id);
}

function authorizeUnitDefinition(
  subject: AuthorizationSubject,
  action: UnitDefinitionAuthorizationAction,
  definition: UnitDefinition,
  id?: EntityId,
): void {
  const allowed = unitDefinitionAuthorization({
    subject,
    action,
    resource: {
      type: UNIT_DEFINITION_RESOURCE,
      ...(id ? { id: id as never } : {}),
      attributes: {
        ownerId: definition.ownerId,
        visibility: definition.visibility ?? 'private',
      },
    },
  });
  if (!allowed)
    throw new AuthorizationDeniedError(action, UNIT_DEFINITION_RESOURCE);
}

function requireUnitWorkspaceAccess(subject: AuthorizationSubject): void {
  if (
    subject.roles.includes(AUTHORIZATION_ROLES.KEEPER) ||
    subject.roles.includes(AUTHORIZATION_ROLES.ADMIN)
  )
    return;
  throw new AuthorizationDeniedError('list', UNIT_DEFINITION_RESOURCE);
}

const ALL_LIFECYCLE: readonly LifecycleStatus[] = [
  'active',
  'inactive',
  'marked-for-deletion',
  'deleted',
];

function replaceUnitDefinition(
  current: UnitDefinition,
  draft: CustomUnitDefinitionDraft,
): UnitDefinition {
  return createUnitDefinition({
    ...current,
    code: current.code,
    representation: createUnitRepresentation({
      ...current.representation,
      symbol: draft.symbol,
      asciiFallback: draft.asciiFallback,
      position: draft.position ?? current.representation.position,
      spacing: draft.spacing ?? current.representation.spacing,
    }),
  });
}

/** Maps the custom-unit application input into the validated domain value. */
export function createCustomUnitDefinition(
  draft: CustomUnitDefinitionDraft,
  ownerId?: string,
  ownerName?: string,
): UnitDefinition {
  return createUnitDefinition({
    code: createUnitCode(draft.code),
    ...(ownerId === undefined ? {} : { ownerId }),
    visibility: ownerId === undefined ? 'public' : 'private',
    ...(ownerName === undefined ? {} : { ownerName }),
    system: 'custom',
    representation: createUnitRepresentation({
      symbol: draft.symbol,
      asciiFallback: draft.asciiFallback,
      position: draft.position ?? 'suffix',
      spacing: draft.spacing ?? 'narrow',
    }),
    catalogueVersion: 'TANKOS-CUSTOM-1',
  });
}
