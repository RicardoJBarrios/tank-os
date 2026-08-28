# Aquarium authorization contract

This document defines how Aquarium reuses the workspace authentication and
authorization contracts. It is the source of truth for resource permissions;
it does not replace the general decisions in `decisions.md`.

## Responsibilities

- `@tankos/authn` authenticates the user and exposes the current principal and
  global roles through `AuthSessionPort`.
- `@tankos/data-access` carries that identity in `AccessContext` for every
  repository command and query.
- `@tankos/authz` evaluates policies and persists resource-level authorization
  facts through `AuthorizationGrantStore`.
- `@tankos/aquarium` defines Aquarium actions and resource policy attributes.
  It does not know Firebase, Firestore or Angular.
- `@tankos/aquarium-firestore` translates the policy into bounded queries and
  Firestore Rules. Rules are the final security boundary.
- `@tankos/aquarium-ui` only protects navigation and hides unavailable actions;
  it never grants access.

## Global roles

The only global roles are the shared roles from `@tankos/authz`: `keeper` and
`admin`. Per-Aquarium permissions must not be stored in Firebase custom
claims. Claims remain small and stable; resource permissions are persisted as
authorization grants in Firestore.

## Aquarium actions

```text
aquarium.read
aquarium.update
aquarium.manage-topology
aquarium.manage-members
aquarium.delete
aquarium.restore
aquarium.delete-physically
```

An administrator is allowed by the global policy. A keeper is allowed only
when the resource policy finds an active grant for the requested action. In the
first establishment slice, the establishing keeper is treated as the initial
owner capability until explicit membership management is introduced.

## Creation

- A keeper can establish an Aquarium for their own principal only.
- An admin can establish one for their own principal or for an explicitly
  selected keeper.
- The initial owner/member relationship is created by the application and is
  not accepted as arbitrary client-controlled permission data.

The current aggregate field `establishedByKeeperId` represents that initial
keeper association. It is not a substitute for the future membership grant
collection and must not be used to infer access once explicit memberships are
available.

## Permission matrix

| Action | Admin | Keeper with active grant | Keeper without grant |
| --- | --- | --- | --- |
| Read | allow | if `aquarium.read` | deny |
| Update | allow | if `aquarium.update` | deny |
| Manage topology | allow | if `aquarium.manage-topology` | deny |
| Manage members | allow | if `aquarium.manage-members` | deny |
| Logical delete | allow | if `aquarium.delete` | deny |
| Restore | allow | if `aquarium.restore` | deny |
| Physical delete | allow, lifecycle-gated | deny by default | deny |

## Firestore boundary

Rules independently enforce authentication, role claims, ownership or
membership, lifecycle transitions, record shape and immutable identity. A
successful UI policy check or client-side filter is never sufficient.

Rules deny every collection without an explicit match. Aquarium list queries
must be bounded; keepers can only issue queries constrained to their own
initial association in this first slice, while administrators can query all
records. The membership query/index strategy will be added together with the
membership use case so that Firestore can prove list authorization efficiently.
