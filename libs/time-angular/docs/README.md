# Contrato de uso en Angular

`@tankos/time-angular` adapta los contratos temporales a inyección de
dependencias y presentación Angular. Solo se usa en la raíz de composición,
servicios de feature, componentes y plantillas. Dominio y aplicación siguen
dependiendo de los puertos y valores de `@tankos/time`.

## Composición

`provideTimeAngular` no elige un runtime por defecto. La aplicación debe pasar
un único `TimeRuntime` ya compuesto, que agrupa `ClockPort`, `TimePort` y
`TimeZoneDatabasePort`; así esta librería no conoce si la implementación final
usa Date/Intl, Temporal o cualquier otro motor.

```ts
provideTimeAngular(createDateIntlRuntime());
```

`LOCALE_ID` de Angular es el contrato cerrado de idioma y formato regional. No
existe un puerto de localización alternativo. Un locale explícito solo debe
usarse cuando la vista tenga un requisito puntual distinto al de la aplicación.

`provideTimeDisplayContext` registra la zona del acuario mostrado y la del
usuario. La política de presentación de un instante es:

1. zona IANA indicada explícitamente en la operación o el pipe;
2. zona del acuario actual;
3. zona del usuario;
4. UTC.

Los pipes específicos de usuario y acuario hacen visible la intención de la
vista y aplican únicamente la cadena de fallback correspondiente. La zona solo
cambia la representación de un `Instant`, nunca el dato almacenado.

## Valores en plantillas

- `tankInstant`: instante con la política general anterior;
- `tankAquariumInstant`: instante en la zona del acuario, con fallback a la del
  usuario y después UTC;
- `tankUserInstant`: instante en la zona del usuario, con fallback a UTC;
- `tankLocalDate`: fecha civil sin conversión de zona;
- `tankDuration`: duración transcurrida localizada o canónica;
- `tankHumanizeDuration`: texto relativo localizado.

La zona de `tankInstant` se pasa como segundo argumento tras el formato, igual
que en `DatePipe`. `tankLocalDate` no acepta zona porque hacerlo introduciría
una semántica falsa. Para contextos que cambien reactivamente, la zona debe
llegar como argumento desde una signal de la vista; un provider describe el
contexto estable del inyector donde se registra.

## Deuda pendiente: formularios reutilizables

Queda pendiente crear componentes reutilizables para editar fechas y horas e
integrarlos con los formularios dinámicos de Angular. No se incluyen todavía
porque primero debe fijarse el contrato de esos formularios.

Cuando se aborde esta deuda, los componentes deberán ser standalone, usar los
formularios tipados de Angular y consumir los contratos de `@tankos/time` a
través de `@tankos/time-angular`. Deben distinguir una fecha civil
(`LocalDate`) de un instante (`Instant`), recibir o resolver explícitamente la
zona IANA aplicable y dejar la lógica temporal fuera de los componentes de
feature. Su integración se probará con Spectator y sus casos de conversión y
validación se mantendrán como pruebas unitarias específicas.
