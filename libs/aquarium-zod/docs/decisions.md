# Aquarium Zod decisions

- DTOs use ISO-8601 strings for instants so this adapter remains independent of
  Firebase and other persistence providers.
- The schema is strict and bounded before the domain aggregate is constructed.
- Search tokens are denormalized for bounded Firestore candidate queries; they
  are not an authorization mechanism.
