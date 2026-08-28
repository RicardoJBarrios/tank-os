# `@tankos/shell-ui`

Reusable TankOS shell UI. It owns the application chrome and dashboard
presentation so a host can mount it as a self-contained frontend boundary.

## Responsibilities

- Render the top-level navigation and router outlet.
- Provide the shared sign-out interaction through the neutral `AUTH_SESSION`
  port when the host supplies it.
- Render the dashboard without owning Firebase, routing configuration, or
  feature persistence.

The host application remains the composition root: it configures providers,
Firebase adapters and the routes mounted by this shell.

## Running unit tests

Run `nx test shell-ui` to execute the unit tests.
