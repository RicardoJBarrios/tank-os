import { describe, expect, it } from 'vitest';
import {
  createAuthenticatedPrincipal,
  createPrincipalId,
} from './core/authenticated-principal';

describe('authenticated principal', () => {
  it('validates identity and snapshots provider claims', () => {
    const claims = { roles: ['keeper'] };
    const principal = createAuthenticatedPrincipal({
      id: createPrincipalId('keeper-1'),
      displayName: ' Keeper ',
      claims,
    });
    expect(principal).toEqual({
      id: 'keeper-1',
      displayName: 'Keeper',
      claims: { roles: ['keeper'] },
    });
    expect(principal.claims).not.toBe(claims);
  });

  it('rejects an empty id and omits a blank display name', () => {
    expect(() => createPrincipalId(' ')).toThrow(TypeError);
    expect(
      createAuthenticatedPrincipal({
        id: createPrincipalId('keeper-1'),
        displayName: ' ',
        claims: {},
      }),
    ).toEqual({ id: 'keeper-1', claims: {} });
  });
});
