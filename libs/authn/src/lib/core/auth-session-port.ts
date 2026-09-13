import type { AuthenticatedPrincipal } from './authenticated-principal';

/** Opaque credentials understood by the selected authentication adapter. */
export type AuthCredentials = Readonly<Record<string, unknown>>;

/** Provider-neutral error raised when an authenticated session is required. */
export class AuthRequiredError extends Error {
  public constructor() {
    super('Authentication is required');
    this.name = 'AuthRequiredError';
  }
}

/** Authenticated access resolved by the active authentication adapter. */
export interface AuthSessionPort {
  /** Notifies consumers when the authenticated principal changes. */
  readonly subscribe?: (listener: () => void) => () => void;
  readonly principal: () => Promise<AuthenticatedPrincipal>;
  readonly signIn: (credentials: AuthCredentials) => Promise<void>;
  readonly signOut: () => Promise<void>;
  /** Forces credential renewal and returns the refreshed identity facts. */
  readonly refresh: () => Promise<AuthenticatedPrincipal>;
}
