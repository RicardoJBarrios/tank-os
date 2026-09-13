import { AuthRequiredError } from '@tankos/authn';
import { AUTH_SESSION } from '@tankos/authn-angular';
import {
  authorizationSubjectFromPrincipal,
  type AuthorizationSubject,
} from '@tankos/authz';
import { inject } from '@angular/core';
import {
  Router,
  type ActivatedRouteSnapshot,
  type CanActivateFn,
  type RouterStateSnapshot,
} from '@angular/router';

export type AuthorizationRoutePolicy = (
  subject: AuthorizationSubject,
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => boolean | Promise<boolean>;

export interface AuthorizationGuardOptions {
  readonly policy: AuthorizationRoutePolicy;
}

/** Creates a Router guard that maps authentication and authorization outcomes. */
export function createAuthorizationGuard(
  options: AuthorizationGuardOptions,
): CanActivateFn {
  return function authorizationGuard(route, state) {
    const session = inject(AUTH_SESSION);
    const router = inject(Router);

    return session
      .principal()
      .then(authorizationSubjectFromPrincipal)
      .then((subject) => options.policy(subject, route, state))
      .then((allowed) =>
        allowed
          ? true
          : router.createUrlTree(['/forbidden'], {
              queryParams: { returnUrl: state.url },
            }),
      )
      .catch((error: unknown) => {
        if (error instanceof AuthRequiredError) {
          return router.createUrlTree(['/login'], {
            queryParams: { returnUrl: state.url },
          });
        }
        throw error;
      });
  };
}

/** Convenience policy for routes requiring one of the supplied roles. */
export function requireAnyRole(
  ...roles: readonly string[]
): AuthorizationRoutePolicy {
  return (subject) => roles.some((role) => subject.roles.includes(role));
}
