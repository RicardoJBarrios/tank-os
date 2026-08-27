/* eslint-disable @nx/enforce-module-boundaries -- this library is the Firestore adapter boundary. */
import {
  startAfter,
  type Firestore,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';
import {
  createFirestoreCrudRepository,
  createFirestoreRecordSchema,
} from '@tankos/data-access-firestore';
import {
  createPageCursor,
  type CrudRecord,
  type CrudRepositoryPort,
  type ListRequest,
  type PageCursor,
} from '@tankos/data-access';
import type { Aquarium } from '@tankos/aquarium';
import {
  aquariumDtoSchema,
  aquariumSchema,
  aquariumSearchToken,
  aquariumToDto,
  type AquariumDto,
} from '@tankos/aquarium-zod';
import type { ClockPort } from '@tankos/time';
import {
  orderBy,
  query,
  where,
  type CollectionReference,
} from 'firebase/firestore';

export interface AquariumFilter {
  readonly name?: string;
  readonly establishedByKeeperId?: string;
}

export interface AquariumFirestoreFactoryOptions {
  readonly firestore: Firestore;
  readonly clock: ClockPort;
}

export type AquariumFirestoreRepository = CrudRepositoryPort<
  Aquarium,
  Aquarium,
  Aquarium,
  AquariumFilter
>;

/** Creates the Firestore adapter for the Aquarium aggregate. */
export function createAquariumFirestoreRepository(
  options: AquariumFirestoreFactoryOptions,
): AquariumFirestoreRepository {
  const repository = createFirestoreCrudRepository<
    AquariumDto,
    Aquarium,
    Aquarium,
    AquariumFilter
  >({
    firestore: options.firestore,
    collectionPath: 'aquariums',
    clock: options.clock,
    recordSchema: createFirestoreRecordSchema(aquariumDtoSchema),
    createId: (input) => input.id,
    createData: (input, id) => aquariumToDto(input, id),
    updateData: (input, aquarium, id) => aquariumToDto(aquarium, id),
    buildQuery: buildAquariumQuery,
    encodeCursor: encodeAquariumCursor,
    applyCursor: (_builtQuery, cursor) =>
      startAfter(...parseAquariumCursor(cursor)),
    authorize: authorizeAquariumOperation,
  });

  return mapRepository(repository);
}

function buildAquariumQuery(
  reference: CollectionReference,
  request: ListRequest<AquariumFilter>,
) {
  const lifecycle = where('lifecycle.status', 'in', [
    ...(request.lifecycle ?? ['active', 'inactive']),
  ]);
  const nameToken = request.filter?.name
    ? aquariumSearchToken(request.filter.name)
    : undefined;
  const name = nameToken
    ? [where('data.nameSearchTokens', 'array-contains', nameToken)]
    : [];
  const owner = request.filter?.establishedByKeeperId
    ? [
        where(
          'data.establishedByKeeperId',
          '==',
          request.filter.establishedByKeeperId,
        ),
      ]
    : [];
  const access = request.access.roles.includes('admin')
    ? [...owner]
    : [where('data.establishedByKeeperId', '==', request.access.principalId)];
  return query(
    reference,
    ...access,
    ...name,
    lifecycle,
    orderBy('data.name', 'asc'),
    orderBy('__name__', 'asc'),
  );
}

function authorizeAquariumOperation(
  access: { readonly principalId: string; readonly roles: readonly string[] },
  operation: string,
): void {
  if (!access.principalId || !hasAquariumRole(access.roles))
    throw new Error('Aquarium access requires keeper or admin access');
  if (operation === 'delete' && !access.roles.includes('admin'))
    throw new Error('Only admins can permanently delete Aquariums');
}

function hasAquariumRole(roles: readonly string[]): boolean {
  return roles.includes('keeper') || roles.includes('admin');
}

function encodeAquariumCursor(snapshot: QueryDocumentSnapshot): PageCursor {
  const data = snapshot.data() as { readonly data: { readonly name: string } };
  return createPageCursor(
    JSON.stringify({ name: data.data.name, id: snapshot.id }),
  );
}

function parseAquariumCursor(cursor: PageCursor): [string, string] {
  try {
    const value: unknown = JSON.parse(cursor);
    if (isCursor(value)) return [value.name, value.id];
  } catch {
    // Cursors are untrusted input and are reported as validation failures.
  }
  throw new TypeError('Invalid Aquarium page cursor');
}

function isCursor(value: unknown): value is { name: string; id: string } {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    isNonEmptyString(candidate['name']) && isNonEmptyString(candidate['id'])
  );
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

function mapRepository(
  repository: CrudRepositoryPort<
    AquariumDto,
    Aquarium,
    Aquarium,
    AquariumFilter
  >,
): AquariumFirestoreRepository {
  const versioned = repository.replaceVersioned;

  return {
    list: (request) =>
      repository.list(request).then((page) => ({
        ...page,
        items: page.items.map((record) => requireAquariumRecord(record)),
      })),
    get: (request) => repository.get(request).then(mapAquariumRecord),
    create: (request) => repository.create(request).then(requireAquariumRecord),
    replace: (request, input) =>
      repository.replace(request, input).then(requireAquariumRecord),
    ...(versioned
      ? {
          replaceVersioned: (
            request: Parameters<typeof versioned>[0],
            input: Aquarium,
          ) => versioned(request, input).then(requireAquariumRecord),
        }
      : {}),
    markForDeletion: (request) =>
      repository.markForDeletion(request).then(requireAquariumRecord),
    restore: (request) =>
      repository.restore(request).then(requireAquariumRecord),
    delete: (request) => repository.delete(request),
  };
}

function mapAquariumRecord(
  record: CrudRecord<AquariumDto> | undefined,
): CrudRecord<Aquarium> | undefined {
  return record
    ? {
        ...record,
        data: aquariumSchema.parse({ ...record.data, storageId: record.id }),
      }
    : undefined;
}

function requireAquariumRecord(
  record: CrudRecord<AquariumDto>,
): CrudRecord<Aquarium> {
  const mapped = mapAquariumRecord(record);
  if (mapped === undefined) throw new Error('Aquarium record is missing');
  return mapped;
}
