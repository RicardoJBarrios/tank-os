import {
  AUTHORIZATION_ROLES,
  AuthorizationDeniedError,
  createAuthorizationPort,
  authorizationSubjectFromPrincipal,
  hasAuthorizationRole,
  type AuthorizationRequest,
} from './authorization';

describe('createAuthorizationPort', () => {
  const request: AuthorizationRequest = {
    subject: { id: 'user-1', roles: ['keeper'] },
    action: 'read',
    resource: {
      type: 'domain-resource',
      id: 'resource-1',
      attributes: { ownerId: 'user-1' },
    },
  };

  it('returns true when the domain policy allows the request', async () => {
    const policy = createAuthorizationPort(() => true);
    await expect(policy.can(request)).resolves.toBe(true);
    await expect(policy.authorize(request)).resolves.toBeUndefined();
  });

  it('returns false without throwing when the domain policy denies the request', async () => {
    const policy = createAuthorizationPort(() => false);
    await expect(policy.can(request)).resolves.toBe(false);
  });

  it('throws a provider-neutral error for a denied request', async () => {
    const policy = createAuthorizationPort(() => false);
    await expect(policy.authorize(request)).rejects.toEqual(
      new AuthorizationDeniedError('read', 'domain-resource'),
    );
  });

  it('passes the complete request to an asynchronous domain policy', async () => {
    const policy = vi.fn().mockResolvedValue(true);
    const authorization = createAuthorizationPort(policy);
    await authorization.can(request);
    expect(policy).toHaveBeenCalledWith(request);
  });

  it('exposes the two general roles and checks them without interpreting domains', () => {
    expect(AUTHORIZATION_ROLES).toEqual({ KEEPER: 'keeper', ADMIN: 'admin' });
    expect(
      hasAuthorizationRole(request.subject, AUTHORIZATION_ROLES.KEEPER),
    ).toBe(true);
    expect(
      hasAuthorizationRole(request.subject, AUTHORIZATION_ROLES.ADMIN),
    ).toBe(false);
  });

  it('interprets plural, singular and absent role claims at the authz boundary', () => {
    expect(
      authorizationSubjectFromPrincipal({
        id: 'plural' as never,
        displayName: 'Keeper One',
        claims: { roles: ['keeper', 'admin'], tenant: 'reef' },
      }),
    ).toEqual({
      id: 'plural',
      roles: ['keeper', 'admin'],
      attributes: {
        roles: ['keeper', 'admin'],
        tenant: 'reef',
        displayName: 'Keeper One',
      },
    });
    expect(
      authorizationSubjectFromPrincipal({
        id: 'singular' as never,
        claims: { role: 'keeper' },
      }).roles,
    ).toEqual(['keeper']);
    expect(
      authorizationSubjectFromPrincipal({
        id: 'none' as never,
        claims: { roles: [42], role: ' ' },
      }).roles,
    ).toEqual([]);
  });
});
