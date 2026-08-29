# Frontera de implementación con Date/Intl

`@tankos/time-date-intl` es la implementación concreta actual de los contratos
de `@tankos/time`. Es la única librería temporal que puede usar directamente las
API JavaScript `Date` e `Intl` para parseo, cálculo, reloj del sistema y reglas
de zonas horarias IANA.

Su entrada preferente es `createDateIntlRuntime`. Las factorías públicas
`createDateIntlClock`, `createDateIntlTimeAdapter` y
`createDateIntlTimeZoneDatabase` permiten reemplazos deliberados en otras raíces
de composición. Los nombres de operaciones internas no forman parte del
contrato y pueden cambiar sin afectar a consumidores.

## Uso permitido

La raíz de composición de la aplicación crea el runtime y lo registra en
Angular. `createDateIntlRuntime` garantiza que el adaptador y la presentación
compartan una única base de zonas. Dominio, aplicación, componentes y
adaptadores reutilizables no pueden importar esta librería.

```ts
provideTimeAngular(createDateIntlRuntime());
```

`provideTimeAngular` no compone el `TimePort` a partir de dos argumentos porque
eso obligaría a la librería Angular a conocer el runtime Date/Intl. Recibe el
contrato neutral `TimeRuntime` ya compuesto por la implementación elegida.

La resolución de una hora local exige una zona IANA o un offset explícito. Una
hora inexistente o ambigua durante un cambio horario se rechaza para evitar que
el runtime elija silenciosamente otro instante. Toda salida canónica de un
`Instant` vuelve a UTC. Un offset como `+01:00` no pasa por el validador de zonas
IANA: debe llegar a la operación específica de resolución por offset.

Cuando se adopte Temporal u otra implementación se añadirá otro paquete de
runtime; no se modificará `@tankos/time` para adaptarlo a detalles de ese motor.
