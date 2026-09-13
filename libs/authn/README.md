# `@tankos/authn`

Provider- and framework-neutral authentication contracts for TankOS.

`AuthSessionPort` resolves an `AuthenticatedPrincipal`, signs in, signs out and
refreshes credentials. It reports provider claims as identity facts; it does
not interpret roles or decide resource permissions.

Angular composition lives in `@tankos/authn-angular` and Firebase Auth in
`@tankos/authn-firebase`. See [`docs/README.md`](docs/README.md).
