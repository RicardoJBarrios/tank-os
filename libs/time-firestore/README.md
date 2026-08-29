# Adaptador temporal de TankOS para Firestore

`@tankos/time-firestore` es la frontera física entre `@tankos/time` y Firestore.
Convierte instantes a `Timestamp`, fechas civiles a cadenas `YYYY-MM-DD` y
duraciones a milisegundos enteros.

```ts
const firestoreTime = createFirestoreTimeAdapter(runtime.timePort);
```

Cada conversión se implementa y prueba de forma aislada en su propio fichero,
incluidos los valores inválidos y la precisión submilisegundo. La factoría solo
compone esas conversiones. El barrel público expone el adaptador y sus tipos,
pero no las operaciones internas usadas para probarlo.

Las duraciones leídas deben ser enteros seguros. Los valores fraccionarios o
fuera de rango se rechazan para no ocultar documentos persistidos con una
representación incompatible.

Este paquete puede depender de Firebase y `@tankos/time`; no selecciona el
runtime Date/Intl ni conoce Angular.

- `pnpm nx run time-firestore:build`
- `pnpm nx run time-firestore:test`

Consulta [`docs/README.md`](docs/README.md).
