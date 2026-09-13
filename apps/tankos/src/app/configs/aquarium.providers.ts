/* c8 ignore file -- lazy composition glue is exercised by the browser E2E suite. */
/* eslint-disable @nx/enforce-module-boundaries -- this is the composition root. */
import { inject, type Provider } from '@angular/core';
import {
  createAquariumId,
  createAquariumName,
  createAquariumSystem,
  aquariumAuthorizationPolicy,
  AQUARIUM_ACTIONS,
  AQUARIUM_RESOURCE_TYPE,
  type AccessibleAquariumReader,
  type AquariumManager,
  type AquariumEstablisher,
} from '@tankos/aquarium';
import {
  AuthorizationDeniedError,
  AUTHORIZATION_ROLES,
  type AuthorizationSubject,
} from '@tankos/authz';
import { createEntityId } from '@tankos/data-access';
import {
  createAquariumFirestoreRepository,
  type AquariumFirestoreRepository,
} from '@tankos/aquarium-firestore';
import {
  ACCESSIBLE_AQUARIUM_READER,
  AQUARIUM_MANAGER,
  AQUARIUM_ESTABLISHER,
} from '@tankos/aquarium-ui';
import { TIME_CLOCK } from '@tankos/time/angular';
import { tankosFirestore } from './firebase';

/** Firebase composition loaded only when the Aquarium feature is requested. */
export function provideTankosAquarium(): Provider[] {
  return [
    {
      provide: AQUARIUM_ESTABLISHER,
      useFactory: createAquariumEstablisher,
    },
    {
      provide: ACCESSIBLE_AQUARIUM_READER,
      useFactory: createAccessibleAquariumReader,
    },
    { provide: AQUARIUM_MANAGER, useFactory: createAquariumManager },
  ];
}

function createAquariumEstablisher(): AquariumEstablisher {
  const clock = inject(TIME_CLOCK);
  const repository = createAquariumFirestoreRepository({
    firestore: tankosFirestore,
    clock,
  });
  return {
    establish: async (subject, input) => {
      const ownerKeeperId = input.ownerKeeperId ?? input.keeperId;
      if (input.keeperId !== subject.id)
        throw new Error('Aquarium keeper does not match the session');
      if (
        !aquariumAuthorizationPolicy({
          subject,
          action: AQUARIUM_ACTIONS.CREATE,
          resource: {
            type: AQUARIUM_RESOURCE_TYPE,
            attributes: { ownerKeeperId },
          },
        })
      )
        throw new AuthorizationDeniedError(
          AQUARIUM_ACTIONS.CREATE,
          AQUARIUM_RESOURCE_TYPE,
        );
      const aquarium = createAquariumSystem({
        id: createAquariumId(`aquarium-${crypto.randomUUID()}`),
        name: createAquariumName(input.name),
        establishedByKeeperId: ownerKeeperId,
        establishedAt: new Date(clock.now().epochMilliseconds),
        components: [],
        links: [],
      });
      return (
        await repository.create({
          metadata: { actorId: subject.id },
          input: aquarium,
        })
      ).data;
    },
  };
}

function createAccessibleAquariumReader(): AccessibleAquariumReader {
  const clock = inject(TIME_CLOCK);
  const repository = createAquariumFirestoreRepository({
    firestore: tankosFirestore,
    clock,
  });
  return {
    listAccessible: async (subject) => {
      authorizeAquarium(subject, AQUARIUM_ACTIONS.READ, {
        ownerKeeperId: subject.id,
      });
      const page = await repository.list({
        page: {
          // Firestore Rules require every list query to be bounded to 51
          // documents or fewer.
          pageSize: 50,
          orderBy: [{ field: 'data.name', direction: 'asc' }],
        },
        filter: subject.roles.includes(AUTHORIZATION_ROLES.ADMIN)
          ? undefined
          : { establishedByKeeperId: subject.id },
        lifecycle: subject.roles.includes(AUTHORIZATION_ROLES.ADMIN)
          ? ['active', 'inactive', 'marked-for-deletion', 'deleted']
          : ['active', 'inactive'],
      });
      return page.items.map((record) => ({
        id: record.data.id,
        name: record.data.name,
        establishedByKeeperId: record.data.establishedByKeeperId,
        lifecycleStatus: record.lifecycle.status,
      }));
    },
    getAccessible: async (subject, aquariumId) => {
      const record = await repository.get({
        id: createEntityId(aquariumId),
      });
      if (record) {
        authorizeAquarium(subject, AQUARIUM_ACTIONS.READ, {
          ownerKeeperId: record.data.establishedByKeeperId,
        });
      }
      return record
        ? {
            id: record.data.id,
            name: record.data.name,
            establishedByKeeperId: record.data.establishedByKeeperId,
            lifecycleStatus: record.lifecycle.status,
          }
        : null;
    },
  };
}

function createAquariumManager(): AquariumManager {
  const clock = inject(TIME_CLOCK);
  const repository = createAquariumFirestoreRepository({
    firestore: tankosFirestore,
    clock,
  });
  const authorize = authorizeAquariumRecord;
  return {
    get: async (subject, id) => {
      const record = await findAquariumRecord(repository, id);
      if (record) authorize(subject, AQUARIUM_ACTIONS.READ, record);
      return record;
    },
    rename: async (subject, id, name) => {
      const record = await findAquariumRecord(repository, id);
      if (!record) throw new Error('Aquarium record is missing');
      authorize(subject, AQUARIUM_ACTIONS.UPDATE, record);
      await repository.replace(
        {
          metadata: { actorId: subject.id },
          id: record.id,
          expectedRevision: record.revision,
        },
        { ...record.data, name },
      );
    },
    markForDeletion: async (subject, id) => {
      const record = await findAquariumRecord(repository, id);
      if (!record) throw new Error('Aquarium record is missing');
      authorize(subject, AQUARIUM_ACTIONS.DELETE, record);
      await repository.markForDeletion({
        metadata: { actorId: subject.id },
        id: record.id,
        expectedRevision: record.revision,
      });
    },
    restore: async (subject, id) => {
      const record = await findAquariumRecord(repository, id);
      if (!record) throw new Error('Aquarium record is missing');
      authorize(subject, AQUARIUM_ACTIONS.RESTORE, record);
      await repository.restore({
        metadata: { actorId: subject.id },
        id: record.id,
        expectedRevision: record.revision,
      });
    },
    deletePermanently: async (subject, id) => {
      const record = await findAquariumRecord(repository, id);
      if (!record) throw new Error('Aquarium record is missing');
      authorize(subject, AQUARIUM_ACTIONS.DELETE_PHYSICALLY, record);
      await repository.delete({
        metadata: { actorId: subject.id },
        id: record.id,
        expectedRevision: record.revision,
      });
    },
  };
}

function findAquariumRecord(
  repository: AquariumFirestoreRepository,
  id: string,
) {
  return repository.get({
    id: createEntityId(id),
    lifecycle: ['active', 'inactive', 'marked-for-deletion', 'deleted'],
  });
}

function authorizeAquariumRecord(
  subject: AuthorizationSubject,
  action: string,
  record: Awaited<ReturnType<typeof findAquariumRecord>>,
): void {
  if (!record) return;
  authorizeAquarium(subject, action, {
    ownerKeeperId: record.data.establishedByKeeperId,
    lifecycleStatus: record.lifecycle.status,
  });
}

function authorizeAquarium(
  subject: AuthorizationSubject,
  action: string,
  attributes: {
    readonly ownerKeeperId?: string;
    readonly lifecycleStatus?: string;
  },
): void {
  if (
    aquariumAuthorizationPolicy({
      subject,
      action,
      resource: { type: AQUARIUM_RESOURCE_TYPE, attributes },
    })
  )
    return;
  throw new AuthorizationDeniedError(action, AQUARIUM_RESOURCE_TYPE);
}
