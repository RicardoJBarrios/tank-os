# `@tankos/aquarium-zod`

`@tankos/aquarium-zod` validates and maps the external DTO representation of
the Aquarium aggregate. It is a serialization boundary and does not know
Firebase or Firestore.

It validates bounded components, zones, links, dates and search tokens, then
constructs the domain aggregate through `@tankos/aquarium`.
