import { createAuthorizationPort } from '@tankos/authz';
import { createEntityId } from '@tankos/data-access';
import { describe, expect, it } from 'vitest';
import type { UnitDefinition } from '../core';
import {
  UNIT_DEFINITION_RESOURCE,
  canAccessUnitDefinitions,
  unitDefinitionCapabilities,
  unitDefinitionAuthorizationPolicy,
} from './unit-definition-authorization';

describe('unitDefinitionAuthorizationPolicy', () => {
  const keeper = { id: createEntityId('keeper-1'), roles: ['keeper'] };
  const admin = { id: createEntityId('admin-1'), roles: ['admin'] };
  const privateUnit = {
    type: UNIT_DEFINITION_RESOURCE,
    id: createEntityId('unit-1'),
    attributes: { ownerId: keeper.id, visibility: 'private' as const },
  };
  const publicUnit = {
    ...privateUnit,
    attributes: { ownerId: keeper.id, visibility: 'public' as const },
  };

  it('allows a keeper to create and manage a private unit they own', async () => {
    const authorization = createAuthorizationPort(
      unitDefinitionAuthorizationPolicy,
    );

    for (const action of [
      'create',
      'read',
      'use',
      'update',
      'delete',
      'restore',
    ]) {
      await expect(
        authorization.can({ subject: keeper, action, resource: privateUnit }),
      ).resolves.toBe(true);
    }
  });

  it('allows keepers to use public units but not change them', async () => {
    const authorization = createAuthorizationPort(
      unitDefinitionAuthorizationPolicy,
    );

    await expect(
      authorization.can({
        subject: keeper,
        action: 'read',
        resource: publicUnit,
      }),
    ).resolves.toBe(true);
    await expect(
      authorization.can({
        subject: keeper,
        action: 'use',
        resource: publicUnit,
      }),
    ).resolves.toBe(true);
    await expect(
      authorization.can({
        subject: keeper,
        action: 'update',
        resource: publicUnit,
      }),
    ).resolves.toBe(false);
    await expect(
      authorization.can({
        subject: keeper,
        action: 'delete',
        resource: publicUnit,
      }),
    ).resolves.toBe(false);
    await expect(
      authorization.can({
        subject: keeper,
        action: 'publish',
        resource: privateUnit,
      }),
    ).resolves.toBe(false);
  });

  it('denies a keeper access to another keeper private unit', async () => {
    const authorization = createAuthorizationPort(
      unitDefinitionAuthorizationPolicy,
    );

    await expect(
      authorization.can({
        subject: { id: createEntityId('keeper-2'), roles: ['keeper'] },
        action: 'read',
        resource: privateUnit,
      }),
    ).resolves.toBe(false);
  });

  it('allows an admin to publish and manage public units', async () => {
    const authorization = createAuthorizationPort(
      unitDefinitionAuthorizationPolicy,
    );

    await expect(
      authorization.can({
        subject: admin,
        action: 'publish',
        resource: privateUnit,
      }),
    ).resolves.toBe(true);
    await expect(
      authorization.can({
        subject: admin,
        action: 'update',
        resource: publicUnit,
      }),
    ).resolves.toBe(true);
    await expect(
      authorization.can({
        subject: admin,
        action: 'delete',
        resource: publicUnit,
      }),
    ).resolves.toBe(true);
    await expect(
      authorization.can({
        subject: admin,
        action: 'create',
        resource: {
          ...privateUnit,
          attributes: { visibility: 'public' as const },
        },
      }),
    ).resolves.toBe(true);
  });

  it('denies invalid resources, unknown roles and repeated publication', async () => {
    const authorization = createAuthorizationPort(
      unitDefinitionAuthorizationPolicy,
    );

    await expect(
      authorization.can({
        subject: { id: keeper.id, roles: ['viewer'] },
        action: 'read',
        resource: privateUnit,
      }),
    ).resolves.toBe(false);
    await expect(
      authorization.can({
        subject: admin,
        action: 'publish',
        resource: publicUnit,
      }),
    ).resolves.toBe(false);
    await expect(
      authorization.can({
        subject: admin,
        action: 'read',
        resource: { ...privateUnit, type: 'other-resource' },
      }),
    ).resolves.toBe(false);
  });
});

describe('canAccessUnitDefinitions', () => {
  it.each([['keeper'], ['admin']])('allows a %s', (role) => {
    expect(canAccessUnitDefinitions({ id: 'user-1', roles: [role] })).toBe(
      true,
    );
  });

  it('denies users without a unit-management role', () => {
    expect(canAccessUnitDefinitions({ id: 'user-1', roles: ['guest'] })).toBe(
      false,
    );
  });
});

describe('unitDefinitionCapabilities', () => {
  it('derives create and owner filtering capabilities from the access context', () => {
    expect(
      unitDefinitionCapabilities({
        id: createEntityId('keeper-1'),
        roles: ['keeper'],
      }),
    ).toMatchObject({ canCreate: true, canFilterByOwner: false });
    expect(
      unitDefinitionCapabilities({
        id: createEntityId('admin-1'),
        roles: ['admin'],
      }),
    ).toMatchObject({
      canCreate: true,
      canInspectDeleted: true,
      canFilterByOwner: true,
    });
    expect(
      unitDefinitionCapabilities(
        { id: createEntityId('keeper-1'), roles: ['keeper'] },
        { ownerId: 'keeper-1', visibility: 'private' } as UnitDefinition,
      ),
    ).toMatchObject({ canEdit: true, canDelete: true, canPublish: false });
    expect(
      unitDefinitionCapabilities(
        { id: createEntityId('keeper-1'), roles: ['keeper'] },
        { ownerId: 'keeper-1' } as UnitDefinition,
      ).canEdit,
    ).toBe(true);
    expect(
      unitDefinitionCapabilities(
        { id: createEntityId('keeper-1'), roles: ['keeper'] },
        { visibility: 'private' } as UnitDefinition,
      ).canEdit,
    ).toBe(false);
  });
});
