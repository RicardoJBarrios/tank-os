import type { AuthorizationSubject } from '@tankos/authz';
import { describe, expect, it, vi } from 'vitest';

interface MockGuardOptions {
  readonly policy: (subject: AuthorizationSubject) => boolean;
}

const createAuthorizationGuard = vi.hoisted(() =>
  vi.fn(
    (options: MockGuardOptions) => (subject: AuthorizationSubject) =>
      options.policy(subject),
  ),
);

vi.mock('@tankos/authz-angular', () => ({
  createAuthorizationGuard,
}));

import { unitsAuthorizationGuard } from './units-authorization-guard';

describe('unitsAuthorizationGuard', () => {
  it('creates a guard with the unit access policy', () => {
    expect(createAuthorizationGuard).toHaveBeenCalledTimes(1);
  });

  it.each([['keeper'], ['admin']])('allows a %s', (role) => {
    expect(
      unitsAuthorizationGuard({ id: 'user-1' as never, roles: [role] }),
    ).toBe(true);
  });

  it('denies a role without unit-management access', () => {
    expect(
      unitsAuthorizationGuard({ id: 'user-1' as never, roles: ['guest'] }),
    ).toBe(false);
  });
});
