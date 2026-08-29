# Decisiones de Decimal

- Zod no es un adaptador intercambiable: forma parte de `@tankos/decimal`.
- Big.js sí es sustituible y vive en `@tankos/decimal-big-js`.
- Angular vive en `@tankos/decimal-angular`; el locale es `LOCALE_ID`, no un
  puerto configurable.
- No se usa `DecimalPipe`: convierte la entrada a `number` y puede perder
  precisión.
- Firestore y JSON almacenan el valor canónico como cadena, sin adaptadores
  físicos específicos.
