# Contrato de Time

## Fronteras internas

`src/lib/time/core` contiene valores y puertos neutrales;
`src/lib/time/zod` contiene la validación externa decidida para TankOS.
`src/lib/angular` contiene aplicación Angular, composición, adaptadores de
presentación, pipes y formularios. `src/lib/firestore` convierte representaciones
persistidas. El núcleo no importa sus integraciones.

La raíz exporta únicamente núcleo y Zod. Angular y Firestore importan esa raíz
a través de entradas secundarias del mismo paquete, conservadas para que
importar un valor temporal no cargue dependencias de UI o persistencia.
No se mantienen librerías puente, alias antiguos ni proveedores redundantes
para la estructura anterior.

La app selecciona un `TimeRuntime` completo (`clock`, `timePort`,
`timeZoneDatabase`) y lo entrega a `provideTimeAngular`. La integración no
selecciona el motor. Solo la composición de la app y las pruebas importan
`time-luxon`. Su dependencia desde el setup de pruebas no es una
dependencia de producción: el build de Time no construye el runtime.

## Valores

- `Instant`: punto UTC a precisión de milisegundos, no una hora local.
- `LocalDate`: fecha gregoriana civil `YYYY-MM-DD`, sin hora ni zona.
- `LocalTime`: hora civil sin fecha ni zona, de 00:00 a 23:59:59.999.
  `parseLocalTime` acepta valores o `HH:mm[:ss[.SSS]]`;
  `toLocalTimeString` produce siempre `HH:mm:ss.SSS`.
  Rechaza 24:00, segundos intercalares, offsets y precisión superior a milisegundos.
- `Duration`: tiempo transcurrido en milisegundos enteros. El runtime convierte
  unidades ISO de calendario con las aproximaciones predeterminadas de Luxon;
  para desplazar fechas reales por meses/años se usa `CalendarPeriod`.
- `CalendarPeriod`: desplazamiento civil por años, meses y días.
- Zona IANA: reglas para interpretar o presentar un instante, no un offset fijo.

Los valores se validan al entrar; una interfaz TypeScript no sustituye la
validación en ejecución. `LocalTime` no necesita un puerto de motor: su rango y
serialización no dependen de calendario, reloj ni base de zonas.

## Zod y JSON

`createZodTimeSchemas(timePort, timeZoneDatabase)` ofrece `instant`,
`localDate`, `localTime`, `duration` y `timeZone`. Zod pertenece al módulo;
no existe una librería Zod separada. Los esquemas de transporte aceptan cadenas
y devuelven valores de dominio.

La salida usa `toUtcIsoString`, `toLocalDateString`,
`toLocalTimeString` y `toDurationIsoString`. El runtime Luxon interpreta un ISO
sin Z/offset en UTC. Para una hora de una ubicación concreta se usa resolución
con zona/offset explícito; los campos de instantes siempre exigen esa zona.

## Angular, formato y localización

La página pasa el locale del usuario; `LOCALE_ID` es el fallback. La zona puede
proceder del acuario o del usuario según el contexto. Pipes y campos reciben
valores reactivos explícitos. La edición usa Material/Luxon, con sus tipos
encapsulados: véase la [auditoría de paridad](localization-audit.md).
Angular i18n/localize traduce el texto de UI; cambiar el locale regional no
cambia automáticamente el idioma compilado. No hay un puerto alternativo de
localización ni una política de selección de preferencias dentro de Time.

`provideTimeDisplayContext` establece zonas estables del inyector.
La presentación de un instante usa zona explícita, luego acuario, usuario y UTC.
Si el contexto cambia reactivamente, pasar la zona como argumento de una signal;
un provider no es un store de preferencias.

Pipes públicos: `tankInstant`, `tankAquariumInstant`, `tankUserInstant`,
`tankLocalDate`, `tankLocalTime`, `tankDuration` y `tankHumanizeDuration`.
El pipe de fecha civil no recibe zona. Los controles editan valores, no textos
de esos pipes. Véase [formularios](forms.md).

## Fuera del módulo

Time no posee formularios de Aquarium, motores de formularios dinámicos,
planificación de mantenimiento, permisos, repositorios de negocio ni despliegue
Firebase. No necesita puertos abstractos para tecnologías estructurales ya elegidas.

La migración de `Aquarium.establishedAt` y la incorporación de una zona IANA al
agregado siguen pendientes como corte vertical completo.
