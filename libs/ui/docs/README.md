# `@tankos/ui`

`@tankos/ui` is the framework-neutral UX contract for TankOS. It defines
semantic page states and shared layout constraints consumed by visual
implementations.

It does not contain Angular, Material, routing, domain, or persistence logic.
Applications may provide another implementation for a different design system.

## Current scope

- `TankosPageState`: shared loading, empty, error and not-found semantics.
- `TANKOS_UI_LAYOUT`: agreed content and form layout constraints.

## Boundary

Feature libraries own domain-specific content and actions. This library owns
the meaning of shared UX states, not their rendering.
