# Architecture contract

## Composition

The application composition root is `apps/tankos`. Features may remain in the
app until a real boundary exists. Libraries are isolated by Nx tags and ESLint
Boundaries. `legacy/veril` is retained for reference and is outside Nx.

## Domain flow

Use Screaming Hexagonal Architecture:

```text
domain -> application ports <- infrastructure adapters
                           \-> UI/composition
```

Stores coordinate feature state; they do not become domain persistence. Guards
improve navigation UX, never authorization.

## Data and Firestore

- `@tankos/data-access` is a provider- and framework-neutral persistence
  vocabulary: CRUD records, lifecycle, cursor pagination, optimistic revisions
  and atomic version replacement. It contains no authentication,
  authorization, Angular, cache, batch or speculative transport engine.
- Reads carry technical query data only. Writes carry `MutationMetadata` for
  audit/idempotency correlation only; neither request shape is an authorization
  context.
- The owning domain application service authorizes each use case and scopes
  its query before invoking persistence. Repositories and provider adapters do
  not interpret roles.
- A versioned workflow requires `VersionedCrudRepositoryPort` and its atomic
  `replaceVersioned` capability. A create-then-retire fallback is forbidden.
- Firestore is NoSQL: no relational foreign keys or cascade assumptions.
- Store immutable/versioned contracts with explicit logical identifiers and
  snapshots where historical meaning requires them.
- Hide soft-deleted records by default; purge is an explicit administrative or
  controlled batch operation.
- Bound and paginate reads. Prefer domain-scoped local cache with an explicit
  invalidation/bypass path; avoid listeners unless the use case needs them.
- Keep indexes, Firebase configuration, Rules and deployment in the app layer;
  reusable libraries provide ports and adapters, not project deployment.

## Authentication and authorization

- `@tankos/authn` owns the framework-neutral session contract and raw
  `AuthenticatedPrincipal`. It identifies the caller but does not interpret
  roles or permissions.
- Provider implementations such as `@tankos/authn-firebase` return identity
  facts and raw claims. Angular DI and authentication guards live in
  `@tankos/authn-angular`.
- `@tankos/authz` owns authorization subjects, role interpretation, resource
  identifiers, decisions and errors. Each domain owns its resource actions,
  attributes and policy.
- `@tankos/authz-angular` owns Router integration. Guards and hidden controls
  are navigation/presentation aids, never the persisted-data boundary.
- Provider Security Rules or a trusted backend independently enforce access.
  Domain application authorization does not allow a repository to accept or
  infer permissions from roles.

## Time, units and measurements

Time is one capability with internal hexagonal boundaries and one replaceable runtime:

- The `time` project owns temporal logic, canonical Zod schemas, Firestore
  conversions, Angular composition, localized pipes and Material form controls.
  These fixed application technologies do not justify separate Nx libraries.
- Its primary entry point, `@tankos/time`, exposes only neutral values, ports
  and Zod schemas. The internal core cannot import Angular/Firebase or use
  `Date`/`Intl`; it cannot import its own Angular or Firestore entry points.
- `@tankos/time-luxon` is the replaceable implementation using Luxon for
  ISO parsing, calendar arithmetic, clock and time-zone resolution.
- `@tankos/time/angular` and `@tankos/time/firestore` are secondary import
  entry points in that same package, not separately configured projects.
  They keep framework-specific imports out of neutral consumers and the runtime.
  JSON/REST uses the canonical Zod schemas, without a separate package.

Only an app composition root imports the concrete runtime. Its runtime factory
composes one neutral `TimeRuntime` (`clock`, `timePort` and
`timeZoneDatabase`) and passes it to `provideTimeAngular`. The Angular package
must not construct or select the runtime from a partial set of arguments.
Domain/application code consumes the neutral entry point; Angular consumers
use the Angular entry point. Material widget adaptation does not select the
business runtime; native widget values never leave the control.

An `Instant` is on the UTC timeline. `LocalDate`, `LocalTime`, `Duration` and an IANA zone are
not values to convert to UTC. Stored instants use UTC. Presentation precedence
is explicit zone, aquarium zone, user zone, then UTC; Angular localization is
independent from zone selection. Nx tags and ESLint enforce these boundaries.

Known adoption debt: `Aquarium.establishedAt` still uses `Date` and the
aggregate does not yet model its IANA zone. Migrate domain, Zod DTO, form and
Firestore representation together; a partial conversion is not an acceptable
intermediate architecture.

`TimeField` is a standalone Angular Material editor for `LocalDate`, `LocalTime`
or `Instant`. It uses Angular's `ControlValueAccessor`/`Validator` contract for
both Reactive Forms (`FormControl`/`FormGroup`) and Signal Forms' supported CVA
bridge. Do not add a dynamic-form engine or duplicate model state just to support
both APIs. An instant editor requires an explicit IANA zone. Luxon resolves
DST gaps and overlaps using its defaults. Prefer library behavior over custom Time policies
unless a product requirement establishes otherwise. The page
supplies the user's regional locale (with an application fallback)
and passes it explicitly, with `LOCALE_ID` only as fallback. Time does not own
that preference policy. Pipes accept locale arguments; the field must support
a reactive instance-local locale, consistent manual parsing and reformatting
without editing the domain value. Angular i18n governs UI text independently;
neither chooses a time zone. Material owns the calendar/clock UX.

Material's official Luxon adapter is the selected editor implementation, not an
Angular-mandated default. DateTime stays inside the widgets; public form values
remain neutral Time values. Use framework signals, forms events, DateAdapter
and MAT_DATE_FORMATS before custom mechanisms. Use LuxonDateAdapter directly:
accept its parsing fallbacks and normalizations instead of maintaining a custom
strict parser. Configure UTC and the Gregorian calendar through official options.
The domain runtime is also Luxon; no previous Date/Intl runtime or compatibility
alias remains. ISO parsing and serialization follow Luxon; unzoned instant ISO
input is explicitly interpreted in UTC, never in the browser's zone. Calendar
duration units use Luxon's default approximate conversion to milliseconds;
calendar-sensitive operations use CalendarPeriod instead. See
[`Time localization audit`](../libs/time/docs/localization-audit.md) for evidence
and acceptance criteria. Keep the implementation within Time's existing Angular
integration, without separate Nx locale libraries or a preferences abstraction.

`@tankos/units` owns qualified identities, standards, symbols, catalogue
metadata and its canonical Zod boundary schemas. Zod is part of the unit
architecture and is not published as a separate package. Units do not own or
execute conversions. Measurements own values, quantity, method, provenance,
Aquarium/System context and any transformations required by their use cases. A
reusable conversion engine may be introduced later as a separate capability
only when concrete consumers justify it.

Known Angular integration debt: the current `units-ui` project contains the
Units Angular integration, while `units-composition` separately contains one
composition token. The agreed target is `units-angular`, including Angular
services, stores, tokens, providers, guards, routes and presentation under one
integration boundary. Keep the current projects until Data Access and
authentication/authorization contracts have been reviewed; do not treat their
names or separation as the target architecture.

Decimal is split by replacement boundary:

- `@tankos/decimal` owns canonical decimal strings, exact arithmetic ports,
  rounding contexts, typed errors and the closed Zod boundary schemas. It does
  not import Angular, Big.js, Firebase or formatting helpers.
- `@tankos/decimal-big-js` is the replaceable Big.js runtime.
- `@tankos/decimal-angular` owns DI and locale-aware presentation through
  Angular `LOCALE_ID`; it must not use `DecimalPipe`, which coerces values to
  JavaScript `number` and can lose precision.

Decimal persistence and JSON/HTTP use canonical strings validated by the core
schemas, so they do not require dedicated transport packages. Core transport
input is a string: JavaScript numbers may only enter through the explicit
safe-integer conversion because lost binary precision cannot be restored.

## Technology decisions

- Use stable compatible Angular 22, Nx 23 and Angular Material/CDK releases.
- Use standalone APIs, Signals, typed forms, lazy routes and `inject()`.
- Use local Signals for local state and NgRx Signals `22.0.0` `signalStore` for
  shared/complex state, scoped to the smallest useful injector. RxJS is for
  streams and explicit bridges, not a second state store.
- Use Vitest for pure code, Spectator + Vitest for Angular integration,
  Firebase Emulator Suite for Firebase/Rules tests and Playwright for meaningful
  browser journeys. Validate external data with Zod at the boundary.

## Firebase, rendering and offline

- Use the modular Firebase SDK behind adapters. AngularFire is not installed;
  adding it requires a concrete integration need and compatible release.
- Use Auth, Firestore and Hosting under a free-first policy. Local and CI work
  uses emulators and never production. Firebase configuration, Rules, indexes
  and deployment remain app-owned; libraries provide reusable ports/adapters.
- Public routes may be prerendered; private routes use lazy CSR. Angular
  Service Worker caches the app shell/assets, not authenticated data or tokens.
  Preview automation is deferred while repository Actions are disabled.
- Persistent Firestore cache requires trusted-device consent. Firestore remains
  the pending-write queue; classify operations as last-write-wins,
  history-preserving or online-required before adding offline behavior.

## Quality and tooling

Libraries target 100% V8 coverage for lines, statements, functions and branches,
including public contract tests. Nx/ESLint Boundaries, SonarJS, Semgrep,
Gitleaks, Knip and `pnpm audit` enforce the local quality stack. SonarCloud is
an external quality gate invoked by `pnpm quality:sonar`/`quality:all`, receives
LCOV reports, publishes to `master` and excludes `legacy/`.

Use Nx for projects and targets, `rg` for exact retrieval and CodeGraph only
for structural impact after exact search. These tools do not authorize pushes,
secret access or destructive changes.

## Evolution

This file is the single active source for technical decisions. Change the
relevant section when a decision changes and preserve prior rationale under
[`archive/`](archive/). Do not create a separate ADR layer or duplicate the
decision in another active document.
