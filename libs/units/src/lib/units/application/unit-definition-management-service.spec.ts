import {
  createEntityId,
  type CrudRecord,
  type VersionedCrudRepositoryPort,
} from '@tankos/data-access';
import { AuthorizationDeniedError } from '@tankos/authz';
import { describe, expect, it, vi } from 'vitest';
import {
  createUnitCode,
  createUnitDefinition,
  createUnitRepresentation,
  type UnitDefinition,
  type UnitDefinitionFilter,
} from '../core';
import {
  createUnitDefinitionManagementService,
  createCustomUnitDefinition,
} from './unit-definition-management-service';
import type { CustomUnitDefinitionDraft } from './unit-definition-management-contract';

const draft: CustomUnitDefinitionDraft = {
  code: 'TANKOS:CUSTOM-ALK',
  symbol: 'dKH',
  asciiFallback: 'dKH',
};

describe('createUnitDefinitionManagementService', () => {
  it('creates a public definition when no owner is supplied', () => {
    const result = createCustomUnitDefinition(draft);
    expect(result).toMatchObject({ visibility: 'public' });
    expect(result).not.toHaveProperty('ownerId');
    expect(result).not.toHaveProperty('ownerName');
  });

  it('creates a validated custom definition from application input', async () => {
    const repository = createRepository();
    const service = createUnitDefinitionManagementService(repository);
    const subject = {
      id: createEntityId('admin-1'),
      roles: ['admin'],
      attributes: { displayName: 'Admin One' },
    };

    const result = await service.save({ subject, draft });

    expect(result.data).toMatchObject({
      code: 'TANKOS:CUSTOM-ALK',
      system: 'custom',
      ownerId: subject.id,
      ownerName: 'Admin One',
      visibility: 'private',
    });
    expect(repository.create).toHaveBeenCalledWith({
      metadata: { actorId: subject.id },
      input: result.data,
    });
  });

  it('creates a new version and retires the previous definition', async () => {
    const repository = createRepository();
    const service = createUnitDefinitionManagementService(repository);
    const subject = { id: createEntityId('admin-1'), roles: ['admin'] };
    const id = createEntityId('unit-1');
    const current = createUnitDefinition({
      code: createUnitCode('TANKOS:OLD-ALK'),
      ownerId: subject.id,
      visibility: 'private',
      system: 'custom',
      representation: createUnitRepresentation({
        symbol: 'old',
        asciiFallback: 'old',
        position: 'suffix',
        spacing: 'narrow',
      }),
      catalogueVersion: 'TANKOS-CUSTOM-1',
    });

    await service.save({ subject, id, expectedRevision: 3, current, draft });

    expect(repository.replaceVersioned).toHaveBeenCalledWith(
      { metadata: { actorId: subject.id }, id, expectedRevision: 3 },
      expect.objectContaining({
        code: 'TANKOS:OLD-ALK',
        representation: expect.objectContaining({ symbol: 'dKH' }),
      }),
    );
    expect(repository.create).not.toHaveBeenCalled();
    expect(repository.markForDeletion).not.toHaveBeenCalled();
    expect(repository.replace).not.toHaveBeenCalled();
  });

  it('persists the custom unit display position and spacing', async () => {
    const repository = createRepository();
    const service = createUnitDefinitionManagementService(repository);
    const subject = {
      id: createEntityId('keeper-1'),
      roles: ['keeper'],
    };

    await service.save({
      subject,
      draft: { ...draft, position: 'prefix', spacing: 'none' },
    });

    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        input: expect.objectContaining({
          representation: expect.objectContaining({
            position: 'prefix',
            spacing: 'none',
          }),
        }),
      }),
    );
  });

  it('preserves public ownership when an admin replaces a public definition', async () => {
    const repository = createRepository();
    const service = createUnitDefinitionManagementService(repository);
    const subject = { id: createEntityId('admin-1'), roles: ['admin'] };
    const current = createUnitDefinition({
      code: createUnitCode('UN/CEFACT:LTR'),
      system: 'si',
      visibility: 'public',
      representation: createUnitRepresentation({
        symbol: 'L',
        asciiFallback: 'L',
        position: 'suffix',
        spacing: 'narrow',
      }),
      catalogueVersion: 'UN/CEFACT-Rev17-aquarium-core',
    });

    await service.save({
      subject,
      id: createEntityId('unit-1'),
      expectedRevision: 1,
      current,
      currentLifecycle: 'active',
      draft,
    });

    expect(repository.replaceVersioned).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        code: current.code,
        visibility: 'public',
        system: 'si',
      }),
    );
  });

  it('publishes a private definition as a new public version', async () => {
    const repository = createRepository();
    const service = createUnitDefinitionManagementService(repository);
    const subject = { id: createEntityId('admin-1'), roles: ['admin'] };
    const current = createUnitDefinition({
      code: createUnitCode('TANKOS:CUSTOM-ALK'),
      ownerId: 'keeper-1',
      visibility: 'private',
      system: 'custom',
      representation: createUnitRepresentation({
        symbol: 'dKH',
        asciiFallback: 'dKH',
        position: 'suffix',
        spacing: 'narrow',
      }),
      catalogueVersion: 'TANKOS-CUSTOM-1',
    });

    await service.publish({
      subject,
      id: createEntityId('unit-1'),
      expectedRevision: 1,
      current,
      currentLifecycle: 'active',
    });

    expect(repository.replaceVersioned).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        visibility: 'public',
      }),
    );
    expect(repository.replaceVersioned.mock.calls[0]?.[1]).not.toHaveProperty(
      'ownerId',
    );
  });

  it('rejects publishing a previously marked version', async () => {
    const repository = createRepository();
    const service = createUnitDefinitionManagementService(repository);

    await expect(
      service.publish({
        subject: { id: createEntityId('admin-1'), roles: ['admin'] },
        id: createEntityId('unit-1'),
        expectedRevision: 1,
        current: createUnitDefinition({
          code: createUnitCode('TANKOS:CUSTOM-ALK'),
          ownerId: 'keeper-1',
          system: 'custom',
          visibility: 'private',
          representation: createUnitRepresentation({
            symbol: 'dKH',
            asciiFallback: 'dKH',
            position: 'suffix',
            spacing: 'narrow',
          }),
          catalogueVersion: 'test',
        }),
        currentLifecycle: 'marked-for-deletion',
      }),
    ).rejects.toMatchObject({ code: 'UNIT_PUBLISH_INVALID_STATE' });
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('scopes keeper lists to their own private records and keeps admin lists global', async () => {
    const repository = createRepository();
    const service = createUnitDefinitionManagementService(repository);
    const page = {
      pageSize: 20,
      orderBy: [{ field: 'data.code', direction: 'asc' as const }],
    };

    await service.list({
      subject: { id: createEntityId('keeper-1'), roles: ['keeper'] },
      page,
      filter: { visibility: 'private' },
    });
    expect(repository.list).toHaveBeenLastCalledWith({
      page,
      filter: { visibility: 'private', accessibleOwnerId: 'keeper-1' },
    });

    await service.list({
      subject: { id: createEntityId('admin-1'), roles: ['admin'] },
      page,
    });
    expect(repository.list).toHaveBeenLastCalledWith({ page, filter: {} });
  });

  it('rejects unauthorized and hidden catalogue lists', async () => {
    const service = createUnitDefinitionManagementService(createRepository());
    const page = {
      pageSize: 20,
      orderBy: [{ field: 'data.code', direction: 'asc' as const }],
    };

    await expect(
      service.list({
        subject: { id: createEntityId('guest-1'), roles: [] },
        page,
      }),
    ).rejects.toBeInstanceOf(AuthorizationDeniedError);
    await expect(
      service.list({
        subject: { id: createEntityId('keeper-1'), roles: ['keeper'] },
        page,
        lifecycle: ['marked-for-deletion'],
      }),
    ).rejects.toBeInstanceOf(AuthorizationDeniedError);
    await expect(
      service.list({
        subject: { id: createEntityId('keeper-1'), roles: ['keeper'] },
        page,
        lifecycle: ['active', 'deleted'],
      }),
    ).rejects.toBeInstanceOf(AuthorizationDeniedError);
  });

  it('authorizes reads against the returned unit and preserves missing results', async () => {
    const own = createPrivateDefinition('keeper-1');
    const repository = createRepository(createRecord(own));
    const service = createUnitDefinitionManagementService(repository);
    const id = createEntityId('unit-1');

    await expect(
      service.get({
        subject: { id: createEntityId('keeper-1'), roles: ['keeper'] },
        id,
      }),
    ).resolves.toMatchObject({ data: own });
    await expect(
      service.get({
        subject: { id: createEntityId('keeper-2'), roles: ['keeper'] },
        id,
      }),
    ).rejects.toBeInstanceOf(AuthorizationDeniedError);

    repository.get.mockResolvedValueOnce(undefined);
    await expect(
      service.get({
        subject: { id: createEntityId('keeper-1'), roles: ['keeper'] },
        id,
      }),
    ).resolves.toBeUndefined();

    repository.get.mockResolvedValueOnce(
      createRecord({ ...own, visibility: undefined }),
    );
    await expect(
      service.get({
        subject: { id: createEntityId('admin-1'), roles: ['admin'] },
        id,
      }),
    ).resolves.toBeDefined();
  });

  it('authorizes lifecycle commands and passes only technical mutation metadata', async () => {
    const current = createPrivateDefinition('keeper-1');
    const repository = createRepository(createRecord(current));
    const service = createUnitDefinitionManagementService(repository);
    const subject = { id: createEntityId('keeper-1'), roles: ['keeper'] };
    const request = {
      subject,
      id: createEntityId('unit-1'),
      expectedRevision: 4,
    };

    await service.markForDeletion(request);
    await service.restore(request);
    await service.delete(request);

    const command = {
      metadata: { actorId: subject.id },
      id: request.id,
      expectedRevision: 4,
    };
    expect(repository.markForDeletion).toHaveBeenCalledWith(command);
    expect(repository.restore).toHaveBeenCalledWith(command);
    expect(repository.delete).toHaveBeenCalledWith(command);
    expect(repository.get).toHaveBeenCalledWith({
      id: request.id,
      lifecycle: ['active', 'inactive', 'marked-for-deletion', 'deleted'],
    });
  });

  it('rejects lifecycle commands for missing or foreign units', async () => {
    const id = createEntityId('unit-1');
    const missing = createUnitDefinitionManagementService(createRepository());
    await expect(
      missing.restore({
        subject: { id: createEntityId('keeper-1'), roles: ['keeper'] },
        id,
        expectedRevision: 1,
      }),
    ).rejects.toMatchObject({ code: 'UNIT_NOT_FOUND' });

    const foreign = createUnitDefinitionManagementService(
      createRepository(createRecord(createPrivateDefinition('keeper-2'))),
    );
    await expect(
      foreign.markForDeletion({
        subject: { id: createEntityId('keeper-1'), roles: ['keeper'] },
        id,
        expectedRevision: 1,
      }),
    ).rejects.toBeInstanceOf(AuthorizationDeniedError);
  });

  it('rejects unauthorized creation, replacement, and publication', async () => {
    const service = createUnitDefinitionManagementService(createRepository());
    const guest = { id: createEntityId('guest-1'), roles: [] };
    const keeper = { id: createEntityId('keeper-1'), roles: ['keeper'] };
    const foreign = createPrivateDefinition('keeper-2');

    await expect(
      service.save({ subject: guest, draft }),
    ).rejects.toBeInstanceOf(AuthorizationDeniedError);
    await expect(
      service.save({
        subject: keeper,
        id: createEntityId('unit-1'),
        expectedRevision: 1,
        current: foreign,
        draft,
      }),
    ).rejects.toBeInstanceOf(AuthorizationDeniedError);
    await expect(
      service.publish({
        subject: keeper,
        id: createEntityId('unit-1'),
        expectedRevision: 1,
        current: createPrivateDefinition('keeper-1'),
        currentLifecycle: 'active',
      }),
    ).rejects.toBeInstanceOf(AuthorizationDeniedError);
  });

  function createRepository(
    existing?: CrudRecord<UnitDefinition>,
  ): VersionedCrudRepositoryPort<
    UnitDefinition,
    UnitDefinition,
    UnitDefinition,
    UnitDefinitionFilter
  > {
    return {
      list: vi.fn(async () => ({ items: [], hasMore: false })),
      get: vi.fn(async () => existing),
      create: vi.fn(async ({ input }) => createRecord(input)),
      replace: vi.fn(async (_request, input) => createRecord(input)),
      replaceVersioned: vi.fn(async (_request, input) => createRecord(input)),
      markForDeletion: vi.fn(
        async () =>
          existing ?? createRecord(createPrivateDefinition('keeper-1')),
      ),
      restore: vi.fn(
        async () =>
          existing ?? createRecord(createPrivateDefinition('keeper-1')),
      ),
      delete: vi.fn(async () => undefined),
    };
  }
});

function createPrivateDefinition(ownerId: string): UnitDefinition {
  return createUnitDefinition({
    code: createUnitCode('TANKOS:CUSTOM-ALK'),
    ownerId,
    visibility: 'private',
    system: 'custom',
    representation: createUnitRepresentation({
      symbol: 'dKH',
      asciiFallback: 'dKH',
      position: 'suffix',
      spacing: 'narrow',
    }),
    catalogueVersion: 'TANKOS-CUSTOM-1',
  });
}

function createRecord(data: UnitDefinition): CrudRecord<UnitDefinition> {
  return {
    id: createEntityId('unit-1'),
    data,
    lifecycle: { status: 'active' },
    revision: 1,
    metadata: {
      schemaVersion: 1,
      createdAt: { kind: 'instant', epochMilliseconds: 0 },
      updatedAt: { kind: 'instant', epochMilliseconds: 0 },
    },
  };
}
