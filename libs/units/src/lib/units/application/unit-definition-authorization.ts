export * from './unit-definition-authorization-policy';
export * from './unit-definition-capabilities';

import { AUTHORIZATION_ROLES, type AuthorizationSubject } from '@tankos/authz';

/** Coarse route policy for the unit-definition workspace. */
export function canAccessUnitDefinitions(
  subject: AuthorizationSubject,
): boolean {
  return subject.roles.some(
    (role) =>
      role === AUTHORIZATION_ROLES.KEEPER || role === AUTHORIZATION_ROLES.ADMIN,
  );
}
