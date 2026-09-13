# AuthN decisions

- AuthN identifies the principal; it does not decide permissions.
- Provider claims remain raw identity facts in `AuthenticatedPrincipal`.
- Role interpretation is owned by AuthZ, not by a Firebase adapter or Data
  Access.
- The neutral core has no Angular or provider SDK dependency.
- Angular DI and route integration live in `@tankos/authn-angular`.
- Firebase, OAuth or OIDC implementations live in separate provider packages.
- Guards are navigation aids, never the persisted-data security boundary.
