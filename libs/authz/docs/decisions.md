# AuthZ decisions

- AuthZ, not AuthN or Data Access, interprets provider claims as roles.
- Subjects, authorization resource IDs, decisions and errors belong to AuthZ.
- Resource actions and attributes belong to the owning domain policy.
- Domain application services authorize and scope operations before invoking
  persistence.
- Repositories receive technical requests and never infer access from roles.
- Route guards and hidden controls are presentation aids only.
- Provider rules or a trusted backend independently enforce data access.
- Angular integration is isolated in `@tankos/authz-angular`.
