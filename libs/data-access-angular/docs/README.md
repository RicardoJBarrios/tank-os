# `@tankos/data-access-angular`

This package owns the Angular Signal Store used by bounded CRUD lists. It
coordinates loading, cursor pagination, filters, selection and logical
deletion/restoration without knowing a domain or persistence provider.

The host supplies the minimal `CrudListService`: `list`, `markForDeletion` and
`restore`. Requiring only the operations actually consumed avoids pretending
that a list owns create, detail, replacement or physical deletion flows.

Authorization decisions, domain validation, forms, routes, confirmations and
visual styling remain in the owning feature. Firestore stays in
`@tankos/data-access-firestore`; Material rendering stays in
`@tankos/data-access-material-ui`.

The library exposes recoverable operation results so a feature facade can map
errors to its own reactive UI contract without exposing Promise mechanics to
pages. Tests use the shared workspace Vitest configuration and enforce 100%
coverage.
