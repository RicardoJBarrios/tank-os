# `@tankos/ui-material`

Material implementation of the neutral `@tankos/ui` UX contract.

## Visual system

The shared visual theme is **Ocean Indigo**: an indigo-blue primary palette,
coral accent, cool light surfaces and restrained card elevation. Hosts should
import `src/lib/theme/tankos-theme.css` once at their application boundary.
Feature libraries consume the `--tankos-*` tokens and must not introduce a
new primary palette, arbitrary shadows or inconsistent interaction states.

## Components

- `TankosPageHeaderComponent`: eyebrow, title, description and projected actions.
- `TankosStateCardComponent`: loading, empty, error and not-found feedback with
  projected recovery or creation actions.

## Usage

Feature UIs should compose these components and provide only feature-specific
labels, links and actions. They must not import domain or persistence code.

## Limits

This package is an Angular/Material-oriented implementation. The neutral
semantics belong to `@tankos/ui`; another host can implement the same contract
without depending on Material.
