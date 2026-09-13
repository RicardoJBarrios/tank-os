# Data Access decisions

- The core is a provider- and framework-neutral persistence contract.
- Reads carry query data only; writes carry technical `MutationMetadata` only.
- Authentication subjects, roles and authorization policy are not Data Access
  concepts.
- The owning domain authorizes and scopes a use case before calling a
  repository. Adapters do not interpret roles.
- Existing-record commands require `expectedRevision`.
- Versioned replacement is an explicit atomic repository capability. There is
  no create-then-retire fallback.
- Pagination is bounded, ordered and cursor-based.
- Cache, batch and JSON/HTTP abstractions will only return as separate,
  consumer-driven capabilities with concrete guarantees.
- Angular integration is `@tankos/data-access-angular`; visual Material
  integration remains a separate optional package.
