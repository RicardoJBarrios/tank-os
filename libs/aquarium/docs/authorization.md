# Aquarium authorization contract

- AuthN supplies an authenticated principal with raw claims.
- AuthZ translates that principal and evaluates the Aquarium-owned policy.
- The Aquarium application service authorizes each use case and scopes keeper
  lists before invoking persistence.
- Data Access carries only technical queries and mutation metadata.
- Aquarium Firestore persists those requests and never interprets roles.
- Angular guards and capabilities improve navigation and presentation only.
- Firestore Security Rules remain the final client-data boundary.

The shared global roles are `keeper` and `admin`. Per-Aquarium permissions do
not belong in Firebase custom claims. Until explicit memberships exist, the
establishing keeper is the current bounded ownership relation; this is not a
substitute for the later membership model.

Administrators may act globally. Keepers may create for themselves and act
only on an Aquarium allowed by the domain policy. Physical deletion remains a
separate, lifecycle-gated administrative operation. Lists must be bounded and
must include the ownership scope selected by the authorized application use
case.
