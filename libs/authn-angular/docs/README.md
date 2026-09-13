# `@tankos/authn-angular`

This is the framework boundary for authentication. It adapts
`AuthSessionPort` to Angular dependency injection and Router without importing
a provider SDK or interpreting claims.

`provideAuthSession` registers the host-selected session implementation and
`authGuard` handles the unauthenticated navigation outcome. Authorization
guards are separate in `@tankos/authz-angular`; provider login UI remains in
the provider-specific UI package.
