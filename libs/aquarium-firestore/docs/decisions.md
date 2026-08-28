# Aquarium Firestore decisions

- The aggregate is stored in the `aquariums` collection using the shared
  `CrudRecord` envelope.
- `@tankos/aquarium-zod` owns DTO validation and mapping; this adapter owns
  collection paths, queries, cursors and provider composition.
- Keeper queries are restricted to records whose establishing keeper is the
  current principal. This is a safe first slice, not the final multiple-member
  authorization model.
- The adapter reuses `AccessContext` and the shared `keeper`/`admin` roles; it
  does not create a second role or session abstraction. Aquarium actions and
  future resource grants are owned by the Aquarium authorization contract.
- A missing explicit Firestore match is an intentional deny. Application
  authorization and UI guards improve behaviour but cannot replace Rules.
- Name search uses bounded denormalized tokens and remains a candidate query;
  final substring semantics belong to the consuming feature.
- The adapter does not introduce speculative membership subcollections or
  equipment documents before those contracts are defined.
