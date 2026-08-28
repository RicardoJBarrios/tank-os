# Decisions

## Neutral contract and visual adapter

The UX vocabulary is kept in `@tankos/ui`, while Angular rendering lives in
`@tankos/ui-material`. This preserves the option of using another visual system
without changing feature/domain libraries.

## Feature ownership

Features own their content, permissions and navigation. Shared components own
layout and state presentation only.
