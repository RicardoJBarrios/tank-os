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

- Firestore is NoSQL: no relational foreign keys or cascade assumptions.
- Store immutable/versioned contracts with explicit logical identifiers and
  snapshots where historical meaning requires them.
- Hide soft-deleted records by default; purge is an explicit administrative or
  controlled batch operation.
- Bound and paginate reads. Prefer domain-scoped local cache with an explicit
  invalidation/bypass path; avoid listeners unless the use case needs them.
- Keep indexes, Firebase configuration, Rules and deployment in the app layer;
  reusable libraries provide ports and adapters, not project deployment.

## Time, units and measurements

Time is split by reason to change:

- `@tankos/time` owns runtime-neutral value types, ports, arithmetic contracts
  and canonical Zod schemas. It cannot import Angular/Firebase or use `Date`/`Intl`.
- `@tankos/time-date-intl` is the replaceable implementation using today's
  JavaScript `Date` and `Intl` APIs.
- `@tankos/time-angular` owns DI, services, localized display and pipes. It uses
  Angular `LOCALE_ID` and does not select a temporal runtime.
- `@tankos/time-firestore` owns Firestore persistence conversions. JSON/REST
  uses the core Zod schemas and is not a separate package.

Only an app composition root imports the concrete runtime. Its runtime factory
composes one neutral `TimeRuntime` (`clock`, `timePort` and
`timeZoneDatabase`) and passes it to `provideTimeAngular`. The Angular package
must not construct or select Date/Intl from a partial set of arguments.
Domain/application code consumes the neutral core; Angular consumers use the
Angular integration.

An `Instant` is on the UTC timeline. `LocalDate`, `Duration` and an IANA zone are
not values to convert to UTC. Stored instants use UTC. Presentation precedence
is explicit zone, aquarium zone, user zone, then UTC; Angular localization is
independent from zone selection. Nx tags and ESLint enforce these boundaries.

Known adoption debt: `Aquarium.establishedAt` still uses `Date` and the
aggregate does not yet model its IANA zone. Migrate domain, Zod DTO, form and
Firestore representation together; a partial conversion is not an acceptable
intermediate architecture.

Known UI debt: create reusable date and time form components for Angular's
dynamic forms. They should consume the contracts from `@tankos/time-angular`,
preserve the semantics of `LocalDate`, `Instant` and IANA zones, and keep
temporal logic out of feature components. This remains deferred until the
dynamic-form contract is defined; it must be implemented as a coordinated UI
workstream rather than as isolated controls.

Units manage standards, symbols and conversions only. Measurements own
quantity, method, provenance and Aquarium/System context.

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
