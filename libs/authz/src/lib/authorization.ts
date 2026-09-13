import type { AuthenticatedPrincipal, PrincipalId } from '@tankos/authn';

declare const authorizationResourceIdBrand: unique symbol;
export type AuthorizationResourceId = string & {
  readonly [authorizationResourceIdBrand]: true;
};

/** General roles understood by the authorization layer. */
export const AUTHORIZATION_ROLES = {
  KEEPER: 'keeper',
  ADMIN: 'admin',
} as const;

export type AuthorizationRole =
  (typeof AUTHORIZATION_ROLES)[keyof typeof AUTHORIZATION_ROLES];

export function hasAuthorizationRole(
  subject: AuthorizationSubject,
  role: AuthorizationRole,
): boolean {
  return subject.roles.includes(role);
}

export interface AuthorizationSubject {
  readonly id: PrincipalId;
  readonly roles: readonly string[];
  readonly attributes?: Readonly<Record<string, unknown>>;
}

export interface AuthorizationResource<TAttributes = unknown> {
  readonly type: string;
  readonly id?: AuthorizationResourceId;
  readonly attributes: TAttributes;
}

export interface AuthorizationRequest<TAttributes = unknown> {
  readonly subject: AuthorizationSubject;
  readonly action: string;
  readonly resource: AuthorizationResource<TAttributes>;
  readonly environment?: Readonly<Record<string, unknown>>;
}

export type AuthorizationPolicy<TAttributes = unknown> = (
  request: AuthorizationRequest<TAttributes>,
) => boolean | Promise<boolean>;

export class AuthorizationDeniedError extends Error {
  public constructor(action: string, resourceType: string) {
    super(`Authorization denied for ${action} on ${resourceType}`);
    this.name = 'AuthorizationDeniedError';
  }
}

export interface AuthorizationPort<TAttributes = unknown> {
  readonly can: (
    request: AuthorizationRequest<TAttributes>,
  ) => Promise<boolean>;
  readonly authorize: (
    request: AuthorizationRequest<TAttributes>,
  ) => Promise<void>;
}

/** A persisted authorization fact, not a precomputed decision. */
export interface AuthorizationGrant {
  readonly id: AuthorizationResourceId;
  readonly subjectId: PrincipalId;
  readonly resourceType: string;
  readonly resourceId: AuthorizationResourceId;
  readonly actions: readonly string[];
  readonly effect: 'allow' | 'deny';
  readonly status: 'active' | 'revoked';
  readonly attributes?: Readonly<Record<string, unknown>>;
}

export interface AuthorizationGrantQuery {
  readonly subjectId: PrincipalId;
  readonly resourceType: string;
  readonly resourceId?: AuthorizationResourceId;
  readonly status?: AuthorizationGrant['status'];
}

/** Persistence boundary for authorization facts. */
export interface AuthorizationGrantStore {
  readonly find: (
    query: AuthorizationGrantQuery,
  ) => Promise<readonly AuthorizationGrant[]>;
  readonly save: (grant: AuthorizationGrant) => Promise<void>;
  readonly revoke: (grantId: AuthorizationResourceId) => Promise<void>;
}

/** Interprets identity-provider claims at the authorization boundary. */
export function authorizationSubjectFromPrincipal(
  principal: AuthenticatedPrincipal,
): AuthorizationSubject {
  return {
    id: principal.id,
    roles: authorizationRolesFromClaims(principal.claims),
    attributes: {
      ...principal.claims,
      ...(principal.displayName ? { displayName: principal.displayName } : {}),
    },
  };
}

function authorizationRolesFromClaims(
  claims: Readonly<Record<string, unknown>>,
): readonly string[] {
  const roles = claims['roles'];
  const validRoles = Array.isArray(roles) ? roles.filter(isNonEmptyString) : [];
  if (Array.isArray(roles) && validRoles.length === roles.length)
    return validRoles;
  const role = claims['role'];
  return typeof role === 'string' && role.trim() ? [role] : [];
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && Boolean(value.trim());
}

export function createAuthorizationPort<TAttributes>(
  policy: AuthorizationPolicy<TAttributes>,
): AuthorizationPort<TAttributes> {
  return {
    can: (request) => Promise.resolve(policy(request)),
    authorize: async (request) => {
      if (await policy(request)) return;
      throw new AuthorizationDeniedError(request.action, request.resource.type);
    },
  };
}
