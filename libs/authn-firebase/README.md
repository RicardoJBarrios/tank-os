# `@tankos/authn-firebase`

Firebase Auth implementation of `@tankos/authn`.

The adapter restores Firebase sessions, signs in/out, refreshes credentials and
returns a neutral principal with raw custom claims. It does not interpret roles
or authorize resources; that belongs to `@tankos/authz`.

See [`docs/README.md`](docs/README.md) for provider and emulator details.
