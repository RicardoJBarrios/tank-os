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
import { AUTH_SESSION } from '@tankos/authn';
import {
  AuthorizationDeniedError,
  type AuthorizationSubject,
} from '@tankos/authz';
import { createEntityId, type AccessContext } from '@tankos/data-access';
import {
  createAquariumFirestoreRepository,
  type AquariumFirestoreRepository,
} from '@tankos/aquarium-firestore';
import {
  ACCESSIBLE_AQUARIUM_READER,
  AQUARIUM_MANAGER,
  AQUARIUM_ESTABLISHER,
} from '@tankos/aquarium-ui';
import { TIME_CLOCK } from '@tankos/time-angular';
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
  const auth = inject(AUTH_SESSION);
  const clock = inject(TIME_CLOCK);
  const repository = createAquariumFirestoreRepository({
    firestore: tankosFirestore,
    clock,
  });
  return {
    establish: async (input) => {
      const access = await auth.access();
      const ownerKeeperId = input.ownerKeeperId ?? input.keeperId;
      if (input.keeperId !== access.principalId)
        throw new Error('Aquarium keeper does not match the session');
      const subject: AuthorizationSubject = {
        id: access.principalId,
        roles: access.roles,
      };
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
      return (await repository.create({ access, input: aquarium })).data;
    },
  };
}

function createAccessibleAquariumReader(): AccessibleAquariumReader {
  const auth = inject(AUTH_SESSION);
  const clock = inject(TIME_CLOCK);
  const repository = createAquariumFirestoreRepository({
    firestore: tankosFirestore,
    clock,
  });
  return {
    listAccessible: async (keeperId) => {
      const access = await auth.access();
      if (access.principalId !== keeperId)
        throw new Error('Aquarium keeper does not match the session');
      const page = await repository.list({
        access,
        page: {
          // Firestore Rules require every list query to be bounded to 51
          // documents or fewer.
          pageSize: 50,
          orderBy: [{ field: 'data.name', direction: 'asc' }],
        },
        lifecycle: access.roles.includes('admin')
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
    getAccessible: async (keeperId, aquariumId) => {
      const access = await auth.access();
      if (access.principalId !== keeperId)
        throw new Error('Aquarium keeper does not match the session');
      const record = await repository.get({
        access,
        id: createEntityId(aquariumId),
      });
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
  return {
    get: (access, id) => repository.get({ access, id: createEntityId(id) }),
    rename: async (access, id, name) => {
      const record = await findAquariumRecord(repository, access, id);
      if (!record) throw new Error('Aquarium record is missing');
      await repository.replace(
        { access, id: record.id, expectedRevision: record.revision },
        { ...record.data, name },
      );
    },
    markForDeletion: async (access, id) => {
      const record = await findAquariumRecord(repository, access, id);
      if (!record) throw new Error('Aquarium record is missing');
      await repository.markForDeletion({
        access,
        id: record.id,
        expectedRevision: record.revision,
      });
    },
    restore: async (access, id) => {
      const record = await findAquariumRecord(repository, access, id);
      if (!record) throw new Error('Aquarium record is missing');
      await repository.restore({
        access,
        id: record.id,
        expectedRevision: record.revision,
      });
    },
    deletePermanently: async (access, id) => {
      const record = await findAquariumRecord(repository, access, id);
      if (!record) throw new Error('Aquarium record is missing');
      await repository.delete({
        access,
        id: record.id,
        expectedRevision: record.revision,
      });
    },
  };
}

function findAquariumRecord(
  repository: AquariumFirestoreRepository,
  access: AccessContext,
  id: string,
) {
  return repository.get({
    access,
    id: createEntityId(id),
    lifecycle: ['active', 'inactive', 'marked-for-deletion', 'deleted'],
  });
}
