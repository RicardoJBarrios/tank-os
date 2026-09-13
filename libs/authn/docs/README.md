# Authentication architecture

`@tankos/authn` answers who is authenticated and manages that session. Its
neutral `AuthSessionPort` exposes `principal()`, sign-in, sign-out and explicit
credential refresh.

`AuthenticatedPrincipal` contains a branded ID, optional display name and raw,
read-only provider claims. AuthN does not turn claims into roles, permissions,
resource scopes or Data Access requests. That interpretation belongs to
`@tankos/authz`.

```text
provider SDK -> @tankos/authn-<provider> -> AuthSessionPort
                                             |
                                             +-> @tankos/authn-angular
                                             +-> @tankos/authz interpretation
```

The core has no Angular, Firebase, Data Access or domain dependency. Angular DI
tokens, providers and the authentication route guard live in
`@tankos/authn-angular`. Provider SDK behavior and error adaptation live in a
provider package such as `@tankos/authn-firebase`.

An authentication guard only improves navigation. Resource authorization must
be enforced by the owning application use case and independently at the data
provider boundary.
