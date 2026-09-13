# Decisions

## The host owns composition

`apps/tankos` keeps bootstrap, Firebase configuration, route composition and
feature adapter providers. `shell-ui` only consumes neutral ports and renders
the shell. This preserves dependency inversion and keeps the library reusable
as a microfrontend-style boundary.

## Forbidden presentation belongs to authz-angular

The authorization UI library owns the reusable forbidden page. The shell does
not duplicate authorization presentation and the host only maps `/forbidden`
to the exported component.
