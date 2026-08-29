# Integración Decimal para Angular

`@tankos/decimal-angular` registra un `DecimalRuntime` ya elegido por la
aplicación y aporta `DecimalService` y el pipe `tankDecimal`.

```ts
provideDecimalAngular(createBigJsDecimalRuntime());
```

El locale es el contrato cerrado `LOCALE_ID`. El pipe usa ese identificador para
obtener los símbolos regionales con `Intl`, formatea la cadena canónica
directamente y no delega en `DecimalPipe` ni convierte el valor a `number`.

- `pnpm nx run decimal-angular:build`
- `pnpm nx run decimal-angular:test`

Consulta [docs/README.md](docs/README.md).
