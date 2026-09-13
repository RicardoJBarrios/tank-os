# Authorization architecture

`@tankos/authz` interprets authenticated identity facts and evaluates
provider-neutral authorization policies. It owns subjects, resource IDs,
actions, authorization errors and optional persisted authorization grants. It
does not know Angular, Firebase or business entities.

`authorizationSubjectFromPrincipal` is the single shared translation from an
AuthN principal to an authorization subject. It interprets `roles` or `role`
claims and preserves other claims as opaque attributes. Provider adapters must
not duplicate this policy.

Each domain owns the vocabulary and policy for its resource. The domain
application service must authorize the operation and scope list queries before
calling Data Access. Repositories persist already-authorized technical
requests; they do not inspect roles.

```text
AuthN principal -> AuthZ subject -> domain policy/use case -> Data Access port
                                                            |
                                                            v
                                             provider enforcement/rules
```

`can()` supports conditional presentation. `authorize()` and typed domain
checks protect application commands. Neither replaces Firestore Security Rules
or a trusted backend. Missing roles, attributes or explicit policy decisions
deny access by default.

Angular route composition lives in `@tankos/authz-angular`. Firestore storage
of authorization facts lives in `@tankos/authz-firestore`.
