# Firebase Auth adapter

`@tankos/authn-firebase` is the only authentication package that imports the
Firebase Auth SDK. It maps Firebase UID, display name and token claims to
`AuthenticatedPrincipal`, supports email/password sign-in and forces token
renewal when `refresh()` is requested.

Claims are returned unchanged as identity facts. Role extraction and resource
decisions happen in AuthZ; memberships and per-resource permissions must not be
embedded here.

The local helper targets the Firebase Auth Emulator and may use a configured
development-only fallback account. It is not a production credential path.
Tests mock Firebase behavior and cover restoration, raw claims, sign-in,
sign-out, refresh and expected failures.
