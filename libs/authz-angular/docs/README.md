# `@tankos/authz-angular`

Angular Router integration for the neutral AuthZ contract. It resolves the
current principal through `@tankos/authn-angular`, translates it at the AuthZ
boundary and delegates the decision to a host-supplied route policy.

An unauthenticated session redirects to `/login`; an authenticated but denied
subject redirects to `/forbidden`. Unexpected failures remain visible to the
global error boundary.

The guard is navigation UX, not persisted-data security. The owning domain
application service and provider rules must independently enforce access.
