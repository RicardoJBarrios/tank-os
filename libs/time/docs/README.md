# Contrato de `@tankos/time`

Esta librería define el modelo temporal que pueden usar dominio, aplicación y
fronteras de validación sin conocer Angular, Firebase ni la implementación de
fechas elegida por la aplicación.

## Valores y semántica

- `Instant` representa un punto de la línea temporal UTC. Se persiste y se
  intercambia normalizado, nunca como una fecha local implícita.
- `LocalDate` representa una fecha civil del calendario gregoriano (`YYYY-MM-DD`)
  sin hora ni zona. Cumpleaños, días de mantenimiento o fechas de alta suelen
  pertenecer a este tipo.
- `Duration` representa tiempo transcurrido en milisegundos. No equivale a un
  mes o un año civil.
- `CalendarPeriod` permite mover una `LocalDate` por años, meses o días sin
  convertirla en un instante.
- Una zona IANA, como `Atlantic/Canary`, solo aporta reglas al resolver una hora
  local o al mostrar un `Instant`; nunca modifica el instante almacenado.

## Frontera Zod y JSON/REST

Zod es una decisión cerrada de la aplicación y actúa como parser de frontera.
Por eso `createZodTimeSchemas` forma parte de esta librería y no de un paquete
`time-zod` separado. Sus esquemas convierten cadenas externas en valores
temporales del dominio usando los puertos configurados.

JSON/REST tampoco necesita una librería temporal propia:

- entrada: validar `Instant`, `LocalDate`, `Duration` y zona IANA con los
  esquemas de `createZodTimeSchemas`;
- salida: serializar instantes con `TimePort.toUtcIsoString`, duraciones con
  `TimePort.toDurationIsoString` y fechas civiles con
  `TimePort.toLocalDateString`;
- no aceptar cadenas sin `Z` u offset como instantes; si la entrada representa
  una hora local, debe declarar además la zona IANA o el offset y resolverse de
  forma explícita.

## Dependencias permitidas

Esta librería puede contener TypeScript independiente del runtime y Zod. No
puede importar Angular, Firebase, `Date`, `Intl`, pipes, formato de presentación
ni seleccionar una implementación concreta. Las demás librerías deben depender
de sus contratos, no de `@tankos/time-date-intl`.

La aplicación elige la implementación una sola vez en su raíz de composición.
Para sustituir `Date`/`Intl` por Temporal u otro motor solo debe implementarse el
mismo conjunto de puertos; el dominio y los adaptadores de persistencia no deben
cambiar.

## Deuda de migración del agregado Aquarium

`Aquarium.establishedAt` todavía usa `Date` y el agregado aún no modela su zona
IANA. La migración correcta debe modificar conjuntamente dominio, DTO Zod,
formulario y representación Firestore. Hasta abordar ese corte vertical no se
aceptará una adaptación parcial que mezcle el contrato nuevo con el modelo
anterior.
