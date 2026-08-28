# `@tankos/aquarium-firestore`

`@tankos/aquarium-firestore` is the Firestore adapter for the Aquarium
aggregate. It delegates CRUD lifecycle, optimistic revisions, pagination and
technical metadata to `@tankos/data-access-firestore`.

The initial access policy is deliberately restrictive: keepers can query
Aquariums in their initial keeper association and admins can query all
Aquariums. The resource actions and their relationship with `authn` and `authz`
are defined in [`../../aquarium/docs/authorization.md`](../../aquarium/docs/authorization.md).
Multiple keeper membership persistence is intentionally deferred until its
membership use case is introduced. Firestore Rules remain the authoritative
security boundary.
