# Runtime Decimal Big.js de TankOS

`@tankos/decimal-big-js` es la implementación sustituible de aritmética exacta
basada en Big.js. Solo este paquete conoce Big.js; no importa Angular ni crea
providers.

Usa `createBigJsDecimalRuntime()` en una raíz de composición o
`createBigJsDecimalAdapter()` cuando otro runtime deba componerse de forma
explícita.

- `pnpm nx run decimal-big-js:build`
- `pnpm nx run decimal-big-js:test`

Consulta [docs/README.md](docs/README.md).
