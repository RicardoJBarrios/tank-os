# Decisions

## First implementation

Angular Material is the first TankOS implementation, but it is not the
application-wide UX contract. Components expose semantic inputs and projected
actions so feature libraries remain responsible for their use cases.

## Migration strategy

Aquarium is the reference consumer. Units and subsequent verticals should
adopt the shared header and state components incrementally; duplicated feature
styles should be removed as each page migrates.

## Shared Ocean Indigo theme

The Material implementation owns the visual tokens used by TankOS UI. Indigo
is reserved for primary navigation and actions; coral is reserved for accents
and attention states; red is reserved for destructive or error states. The
theme is imported once by the host and is available to all feature components
through CSS custom properties.

Feature styles may define layout, but should consume the shared tokens for
color, borders, radii, elevation and focus treatment.
