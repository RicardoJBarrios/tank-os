# Aquarium Firestore decisions

- The aggregate is stored in the `aquariums` collection using the shared
  `CrudRecord` envelope.
- `@tankos/aquarium-zod` owns DTO validation and mapping; this adapter owns
  collection paths, queries, cursors and provider composition.
- Keeper queries are restricted to records whose establishing keeper is the
  current principal. This is a safe first slice, not the final multiple-member
  authorization model.
- Name search uses bounded denormalized tokens and remains a candidate query;
  final substring semantics belong to the consuming feature.
- The adapter does not introduce speculative membership subcollections or
  equipment documents before those contracts are defined.
