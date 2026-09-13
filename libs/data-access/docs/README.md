# Data Access architecture

## Purpose

`@tankos/data-access` is the small, provider-neutral persistence vocabulary
shared by TankOS domains. It defines record envelopes, lifecycle, stable cursor
pagination, optimistic concurrency, CRUD repository ports and thin application
delegates. It does not own business entities or access policy.

## Boundaries

```text
domain application service (authorization + use case)
                         |
                         v
              @tankos/data-access ports
                         ^
                         |
              provider-specific adapter
```

The core package contains no Angular, Firebase, HTTP, Zod, authentication,
authorization, cache or batch implementation. Those concerns have independent
reasons to change and cannot be re-exported through the core.

The current physical integrations are:

| Package                           | Responsibility                                          |
| --------------------------------- | ------------------------------------------------------- |
| `@tankos/data-access-firestore`   | Firestore CRUD storage, DTO validation and transactions |
| `@tankos/data-access-angular`     | Reusable Angular Signal Store for bounded CRUD lists    |
| `@tankos/data-access-material-ui` | Optional Material presentation                          |

There is no generic JSON/HTTP package until a real consumer establishes its
transport semantics. There is no generic cache or batch engine in this
boundary; those capabilities require explicit use cases and guarantees.

## Requests and authorization

Read requests contain only query information: filter, lifecycle selection and
pagination. Write requests contain `MutationMetadata` with the actor ID and an
optional request ID for audit/idempotency correlation. Neither is an
authorization context.

Authentication resolves a principal. Authorization and query scoping happen
in the owning domain application service. A repository receives only an
already-authorized technical query or command and must never infer permissions
from roles. Provider Security Rules or a trusted backend independently enforce
the final data boundary.

## CRUD, lifecycle and versions

`CrudRepositoryPort` supports list, get, create, replace, logical deletion,
restore and physical deletion. Commands against an existing record require the
last observed `expectedRevision`.

Versioned replacement is a distinct capability:
`VersionedCrudRepositoryPort` requires `replaceVersioned`. A consumer that
needs immutable history cannot silently fall back to create-then-retire across
separate writes. The adapter must provide the operation atomically or the
composition is invalid.

Normal reads hide removed records. An authorized application use case may
select additional lifecycle states explicitly. Pagination is bounded, ordered
and cursor-based; offsets and unbounded collection reads are outside the
contract.

## Testing

Runtime behavior is covered at its owning package boundary with 100% V8
coverage. Provider transactions and Security Rules additionally require
emulator/integration coverage; a core unit test is not evidence of provider
enforcement.
