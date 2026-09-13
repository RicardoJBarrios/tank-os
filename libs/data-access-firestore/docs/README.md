# Firestore Data Access adapter

`@tankos/data-access-firestore` implements the neutral CRUD ports with the
Firebase client SDK. It owns document paths, common record-envelope validation,
timestamps, bounded pagination, optimistic concurrency, error translation and
transactions. Entity adapters supply their own data schema, projection, query
builder and deterministic ID policy.

The adapter receives technical requests only. It does not accept an
authorization subject or roles and does not infer query visibility. The owning
domain application service authorizes and scopes a request first; Firestore
Security Rules independently enforce the final boundary.

Creates transactionally reject deterministic ID collisions. Existing-record
commands require `expectedRevision`. Versioned replacement is one atomic
transaction that creates the replacement and retires the previous record; no
create-then-mark fallback is exposed.

Mutation metadata records the actor ID and optional request ID. Domain fields
and domain timestamps are not rewritten by the adapter. Provider errors are
translated into stable Data Access error categories.

Local Firestore persistence remains an explicit host choice requiring trusted
device consent. It is transport/offline behavior, not an authorization cache
or an application freshness policy.
