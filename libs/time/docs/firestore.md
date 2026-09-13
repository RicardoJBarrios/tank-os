# Representación Firestore

`createFirestoreTimeAdapter(timePort)` se importa desde
`@tankos/time/firestore`, entrada secundaria del mismo módulo Time.
Recibe el puerto compuesto por la app; no selecciona un motor ni crea conexiones.

| Valor       | Persistencia                           | Operaciones                     |
| ----------- | -------------------------------------- | ------------------------------- |
| `Instant`   | `Timestamp`, precisión de milisegundos | `toTimestamp` / `fromTimestamp` |
| `LocalDate` | Cadena `YYYY-MM-DD`                    | `toLocalDate` / `fromLocalDate` |
| `LocalTime` | Cadena `HH:mm:ss.SSS`                  | `toLocalTime` / `fromLocalTime` |
| `Duration`  | Número entero seguro de milisegundos   | `toDuration` / `fromDuration`   |

Una fecha u hora civil no se convierte a `Timestamp`. Las lecturas de duración
fraccionarias o fuera del rango seguro se rechazan. Los instantes se normalizan
a milisegundos: no se promete preservar nanosegundos de Firestore.

Las zonas se almacenan como identificadores IANA validados con los esquemas de
Time. La zona de origen, si tiene valor de negocio, se conserva en un campo
separado del instante. No persistir formato localizado, objetos `Date` ni
offsets como sustitutos de una zona.

Los repositorios, sus DTOs, reglas de seguridad, índices y conexiones pertenecen
a sus dominios y a la app. Esta entrada solo hace conversiones; sus pruebas no
necesitan emulador porque no ejecutan lecturas ni escrituras remotas.
