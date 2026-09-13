declare const principalIdBrand: unique symbol;

/** Stable provider-neutral identity of an authenticated principal. */
export type PrincipalId = string & { readonly [principalIdBrand]: true };

export function createPrincipalId(value: string): PrincipalId {
  if (!value.trim()) throw new TypeError('Principal id must be non-empty');
  return value as PrincipalId;
}

/** Authentication facts returned by the active identity provider. */
export interface AuthenticatedPrincipal {
  readonly id: PrincipalId;
  readonly displayName?: string;
  readonly claims: Readonly<Record<string, unknown>>;
}

export function createAuthenticatedPrincipal(
  principal: AuthenticatedPrincipal,
): AuthenticatedPrincipal {
  return {
    id: createPrincipalId(principal.id),
    ...(principal.displayName?.trim()
      ? { displayName: principal.displayName.trim() }
      : {}),
    claims: { ...principal.claims },
  };
}
