# `@tankos/data-access`

Provider-neutral persistence contracts for CRUD records, lifecycle,
cursor pagination, optimistic concurrency and atomic version replacement.

The package contains no Angular, authentication, authorization, Firebase,
HTTP, cache or batch engine. Domain application services authorize requests
before passing technical queries and mutation metadata to these contracts.

Provider and framework integrations are separate packages:

- `@tankos/data-access-firestore` implements the Firestore persistence port;
- `@tankos/data-access-angular` provides reusable Angular list state;
- `@tankos/data-access-material-ui` provides Material presentation.

See [`docs/README.md`](docs/README.md) for the complete boundary.
