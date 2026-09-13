# Contrato del runtime Luxon

## Composición y fronteras

`createLuxonRuntime()` compone `clock`, `timePort` y `timeZoneDatabase`.
Permite inyectar reloj y base de zonas en pruebas; ambas operaciones de
resolución y presentación usan la base seleccionada.
Las factorías públicas son `createLuxonClock`, `createLuxonTimeAdapter` y
`createLuxonTimeZoneDatabase`. El resto es implementación interna.

Angular recibe el runtime neutral mediante `provideTimeAngular`.
Luxon permanece externo al bundle de esta librería para compartir la dependencia
con el adaptador oficial de Material. El núcleo de Time no importa Luxon.

## Semántica elegida

- ISO: parsing y normalización de Luxon, incluida entrada como `24:00`.
  Un instante ISO sin zona se interpreta en UTC explícitamente, no en la zona del host.
- Fecha civil: se conservan los campos del ISO, sin conversión de zona.
  La salida mantiene el contrato público de años 1–9999.
- Zonas: validación delegada en `IANAZone.isValidZone`; los identificadores
  reconocidos dependen del soporte Intl de la plataforma. Los offsets numéricos
  explícitos se resuelven con `FixedOffsetZone`.
- DST: los huecos se normalizan y las horas repetidas se resuelven según Luxon.
  No se promete elegir siempre el primer o segundo instante de un solapamiento:
  esa selección es del motor, incluida su heurística de offset actual.
  Para conservar una elección exacta se guarda el instante ya resuelto, no solo
  la hora civil; cambiar de zona no debe volver a resolver un valor guardado.
- Duraciones: `Duration.fromISO` acepta las representaciones de Luxon, también
  semanas, meses y años. Su conversión a milisegundos usa los defaults
  aproximados de Luxon (mes de 30 días, año de 365 días), no el calendario
  de una fecha concreta. Para desplazar fechas reales se usa `CalendarPeriod`.
- Serialización: ISO generado por Luxon, no el formato textual del motor antiguo.
  Por ejemplo, 60000 ms se serializan como `PT60S` y -1500 ms como `PT-1.5S`.
  El parser acepta también las representaciones anteriores válidas para Luxon.
- Aritmética civil: `DateTime.plus` gestiona meses y fin de mes.
- Intervalos: se conserva el contrato **cerrado** de Time, incluidos ambos extremos.
  No se sustituye por `Interval.contains` de Luxon, que excluiría el extremo final.

Se conservan las comprobaciones de forma de los valores públicos, la precisión
en milisegundos y los límites numéricos seguros. No se añaden restricciones
sobre los tokens ISO o las decisiones DST por encima de Luxon.

## Persistencia y migración

Los valores internos y las conversiones Firestore siguen siendo neutrales.
La forma textual de duraciones puede cambiar al volver a serializarse; los
consumidores no deben depender de una descomposición concreta en días/horas.
Las pruebas de Time comprueban Zod, Firestore, formularios y pipes con este runtime.
Las pruebas del runtime conservan límites, signos, años bajos, fin de mes,
zonas y composición reemplazable; contrastan las nuevas normalizaciones con Luxon.
