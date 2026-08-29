# Decimal de TankOS

`@tankos/decimal` define el contrato neutral para cálculos decimales seguros.
Representa cada valor como una cadena canónica, integra la validación Zod
cerrada del workspace y no conoce Angular, Big.js, Firebase ni formatos de UI.

La aplicación selecciona un runtime externo, por ejemplo
`createBigJsDecimalRuntime()`, y los consumidores de dominio dependen solo de
este paquete. Los límites JSON y Firestore guardan la cadena canónica y usan
`createZodDecimalSchemas()` para validarla.

No se aceptan `number` en el límite decimal: una precisión binaria perdida no
puede recuperarse. Para enteros JavaScript exactamente representables existe
`decimalFromSafeInteger()`.

- `pnpm nx run decimal:build`
- `pnpm nx run decimal:test`

Consulta [docs/README.md](docs/README.md).
