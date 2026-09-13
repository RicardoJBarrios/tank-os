# `@tankos/authn-angular`

Angular integration for the neutral `@tankos/authn` session contract. It owns
the `AUTH_SESSION` token, provider composition and authentication route guard.

The guard redirects a missing session to `/login` and preserves the requested
return URL. It does not evaluate resource permissions; those belong to AuthZ
and the owning feature.

Run `pnpm nx test authn-angular` for its coverage-gated test suite.
