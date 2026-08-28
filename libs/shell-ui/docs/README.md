# Shell UI

`@tankos/shell-ui` contains the reusable presentation shell for TankOS-like
hosts. It is intentionally independent of Firebase and feature persistence.

## Responsibilities

- Application chrome, top-level navigation and router outlet.
- Shared feedback outlet placement.
- Dashboard presentation and links to mounted features.
- Sign-out interaction through the neutral `AUTH_SESSION` port.

## Boundary

The host remains the composition root. It supplies authentication, feedback,
observability, routes and concrete adapters. Feature routes and providers stay
in their feature libraries or in the host composition layer respectively.

This lets the library be mounted by another host without moving TankOS
infrastructure into a shared UI package.

## Limits

- The shell does not decide authorization.
- Navigation links are host route conventions and must be mounted by the host.
- Text is currently part of the shared UI contract; localization can be added
  through the workspace UI localization boundary when required.

## Testing

Run `nx test shell-ui` for the unit suite and `nx lint shell-ui` for boundary
and Angular template checks.
