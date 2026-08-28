import { describe, expect, it } from 'vitest';
import {
  AQUARIUM_ACTIONS,
  aquariumAuthorizationPolicy,
  AQUARIUM_RESOURCE_TYPE,
} from './aquarium-authorization';

const keeper = {
  id: 'keeper-1' as never,
  roles: ['keeper'],
};

const admin = {
  id: 'admin-1' as never,
  roles: ['admin'],
};

function request(
  subject: typeof keeper,
  action: string,
  attributes: Record<string, unknown> = {},
) {
  return {
    subject,
    action,
    resource: {
      type: AQUARIUM_RESOURCE_TYPE,
      attributes,
    },
  } as never;
}

describe('aquariumAuthorizationPolicy', () => {
  it('allows a keeper to establish only for their own principal', () => {
    expect(
      aquariumAuthorizationPolicy(
        request(keeper, AQUARIUM_ACTIONS.CREATE, {
          ownerKeeperId: 'keeper-1',
        }),
      ),
    ).toBe(true);
    expect(
      aquariumAuthorizationPolicy(
        request(keeper, AQUARIUM_ACTIONS.CREATE, {
          ownerKeeperId: 'keeper-2',
        }),
      ),
    ).toBe(false);
  });

  it('allows an admin to establish for another keeper', () => {
    expect(
      aquariumAuthorizationPolicy(
        request(admin, AQUARIUM_ACTIONS.CREATE, {
          ownerKeeperId: 'keeper-2',
        }),
      ),
    ).toBe(true);
  });

  it('bootstraps the initial keeper association and honours explicit grants', () => {
    expect(
      aquariumAuthorizationPolicy(
        request(keeper, AQUARIUM_ACTIONS.UPDATE, {
          ownerKeeperId: 'keeper-1',
        }),
      ),
    ).toBe(true);
    expect(
      aquariumAuthorizationPolicy(
        request(keeper, AQUARIUM_ACTIONS.MANAGE_MEMBERS, {
          ownerKeeperId: 'keeper-2',
          grantedActions: [AQUARIUM_ACTIONS.MANAGE_MEMBERS],
        }),
      ),
    ).toBe(true);
    expect(
      aquariumAuthorizationPolicy(
        request(keeper, AQUARIUM_ACTIONS.UPDATE, {
          ownerKeeperId: 'keeper-2',
          grantedActions: [AQUARIUM_ACTIONS.READ],
        }),
      ),
    ).toBe(false);
  });

  it('restricts physical deletion to admins and the deletion lifecycle', () => {
    expect(
      aquariumAuthorizationPolicy(
        request(admin, AQUARIUM_ACTIONS.DELETE_PHYSICALLY, {
          lifecycleStatus: 'active',
        }),
      ),
    ).toBe(false);
    expect(
      aquariumAuthorizationPolicy(
        request(admin, AQUARIUM_ACTIONS.DELETE_PHYSICALLY, {
          lifecycleStatus: 'marked-for-deletion',
        }),
      ),
    ).toBe(true);
    expect(
      aquariumAuthorizationPolicy(
        request(keeper, AQUARIUM_ACTIONS.DELETE_PHYSICALLY, {
          ownerKeeperId: 'keeper-1',
        }),
      ),
    ).toBe(false);
  });

  it('denies subjects without a shared Aquarium role', () => {
    expect(
      aquariumAuthorizationPolicy(
        request(
          { id: 'guest-1' as never, roles: [] },
          AQUARIUM_ACTIONS.READ,
          { ownerKeeperId: 'guest-1' },
        ),
      ),
    ).toBe(false);
  });
});
