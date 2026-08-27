# `@tankos/aquarium-firestore`

`@tankos/aquarium-firestore` is the Firestore adapter for the Aquarium
aggregate. It delegates CRUD lifecycle, optimistic revisions, pagination and
technical metadata to `@tankos/data-access-firestore`.

The initial access policy is deliberately restrictive: keepers can query
Aquariums they established and admins can query all Aquariums. Multiple keeper
membership persistence is intentionally deferred until its authorization
contract is defined. Firestore Rules remain the authoritative security boundary.
