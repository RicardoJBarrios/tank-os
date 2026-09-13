# Aquarium Firestore decisions

- Aquariums use the shared `CrudRecord` envelope in the `aquariums` collection.
- Aquarium Zod owns domain DTO validation; this adapter owns Firestore
  projection, queries, cursors and provider composition.
- Keeper queries receive an explicit establishing-owner filter from the
  Aquarium application service. The repository does not inspect roles.
- That owner filter is the current first slice, not the future membership
  model.
- Application authorization and UI guards do not replace Security Rules.
- Reads stay bounded and ordered; speculative membership or equipment storage
  is deferred until those use cases exist.
