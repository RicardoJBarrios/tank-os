# TankOS Units

**Status:** the provider-independent unit model and custom-unit CRUD
application contract are implemented. Unit
definitions are persisted records; local development seeds the public records
into the Firestore emulator. Persistence and transport adapters are separate
packages; the standard CRUD UI is not part of this library's current public API.

**Known debt:** the current Angular feature remains split between `units-ui`
and `units-composition`. After the Data Access and AuthN/AuthZ boundaries are
reviewed, both should be consolidated as `units-angular`. Their present naming
and separation are transitional, not the intended architecture.

`@tankos/units` is a provider-independent domain and application library for
unit identity and scientific representation. Angular forms and components live
in `@tankos/units-ui`.
It models units only; it does not model measurements or observations.
Unit definitions are public or private technical catalogue entries and have no relationship
to an Aquarium, keeper or Aquarium configuration. A Measurement or another
domain record may reference a unit code, but the reference belongs to that
record and never creates an ownership or configuration relationship from the
unit back to an Aquarium.

## Boundaries

Units owns:

- qualified standard unit codes;
- unit systems;
- symbols, Unicode notation, ASCII fallbacks and symbol placement;
- canonical Zod schemas for its external DTO boundary;
- the public/private unit-definition CRUD application boundary.

The first authorization slice is provider-neutral and lives in the application
layer. A `keeper` can create, use and manage a private unit they own, and can
use public units. An `admin` can manage public units and publish a private
unit. The management service evaluates `ownerId` and `visibility` before every
read or command and scopes keeper lists explicitly. Persistence receives no
roles and Firestore Rules remain an independent enforcement boundary.

Units does not own:

- `Measurement`, `Observation` or numeric values paired with units as domain
  records;
- `ParameterDefinition`, aquarium configuration, instruments or IoT devices;
- conversion definitions, conversion execution, salinity, dosing or other
  contextual algorithms;
- Firestore, JSON/HTTP or FIWARE clients;
- custom-unit persistence adapters, moderation screens or batch workflows.

## Public model

Every public reference uses a qualified standard code such as
`UN/CEFACT:LTR`. Labels, aliases and symbols are display metadata and must not
replace that code in APIs or persisted domain references.

`UnitDefinition` is an immutable, value-free definition containing:

- `code` and `catalogueVersion`;
- `system` (`si`, `metric`, `british-imperial`, `us-customary` or `custom`);
- visibility (`private` or `public`) and optional owner projection;
- scientific `UnitRepresentation` metadata;

Built-in definitions without an explicit visibility are normalized as public.
Private definitions must have an owner. Technical lifecycle (`active`,
`marked-for-deletion` or `deleted`) belongs to `@tankos/data-access`, not to
the unit value itself. A future business state such as deprecation must be
introduced separately only when its workflow exists.

Measurement semantics, allowed units, the primary unit and the conversion set
for a measurement type do not belong to this catalogue. They are owned by the
future measurements domain.

Representation metadata records the standard symbol, an ASCII fallback, its
prefix/suffix position and spacing rule. Formatting is presentation work; the
unit model does not turn a measurement into a formatted string.

## Unit catalogue data

The initial public dataset is an aquarium-first subset of UN/CEFACT
Recommendation 20, pinned as `UN/CEFACT-Rev17-aquarium-core`. It contains 13
definitions and is seeded into Firestore for local development:

| Family      | Codes                      |
| ----------- | -------------------------- |
| volume      | `LTR`, `MLT`, `GLI`, `GLL` |
| length      | `MTR`, `CMT`               |
| mass        | `KGM`, `GRM`               |
| temperature | `CEL`, `KEL`, `FAH`        |
| pressure    | `BAR`, `PAL`               |

`GLI` (British Imperial gallon) and `GLL` (US gallon) are distinct units.
The catalogue never collapses them into an ambiguous `gallon`.

The operational catalogue is intentionally smaller than a complete standards
snapshot. A code is not enabled in TankOS merely because it exists in the
external standard. Any catalogue expansion must be added as a persisted record
with its source release and provenance without silently changing an existing
code's meaning.

There is no runtime in-memory standard or effective catalogue. Consumers use
the unit-definition application service backed by their persistence adapter
(Firestore in TankOS), so filtering, pagination and authorization operate on
the same records as CRUD. Deprecated and retired units are not available for
new references.

## Conversion boundary

Units does not define or execute conversions. A transformation is owned by the
consumer that knows its quantity, method and context, initially Measurements.
If multiple bounded contexts later require the same deterministic engine, that
engine must be evaluated as a separate capability from concrete use cases; it
must not be introduced inside the unit catalogue speculatively.

## Architecture

The source layout follows ports and adapters:

```text
core value types
          |
application catalogue management
          |
catalogue persistence adapter
```

The core is framework- and provider-neutral. Its canonical Zod schemas are
published from `@tankos/units`; they are part of the unit boundary rather than
a separate adapter package. `createUnitDefinitionCrudService()` composes
the generic CRUD port for the public/private catalogue and accepts system and
custom definitions at the application boundary. Replacement uses the shared
versioned workflow through the provider's atomic replacement capability. There
is no create-then-retire fallback.

Custom-unit persistence is published behind the `units-firestore` adapter. It
validates DTOs at its boundary and keeps provider types out of the core
contracts. A future transport can implement the same repository port without
belonging to this domain package. Firestore configuration, indexes and Rules
belong to the hosting application.

## Testing and publication

Tests are paired with the implementation responsibility and use Given/When/
Then descriptions as executable documentation. They cover public value
constructors, invalid inputs and CRUD behavior.

The library is packaged with Nx `ng-packagr-lite` and exposes its public API
through `@tankos/units`. Run:

- `pnpm nx run units:build`
- `pnpm nx run units:test`
- `pnpm nx run units:lint`

The test target enforces 100% V8 coverage for executable production code.
