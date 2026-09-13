# Localización y paridad con Angular/Material

Decisión del 2026-09-07: usar Luxon y su adaptador oficial de Angular Material
para la edición temporal. Es una opción oficial, **no un default obligatorio de
Angular**. Referencia: [elección de adaptador Material](https://github.com/angular/components/blob/main/src/material/datepicker/datepicker.md).

## Locale y zona reactivos

El locale es **el del usuario**, con `LOCALE_ID` como fallback de la aplicación.
La zona de presentación puede ser la del acuario o la del usuario según el
contexto. La página entrega ambos valores a Time; no hay una política de
preferencias ni consultas a agregados dentro de esta librería.

Los campos reciben `[locale]` y `[timeZone]`; los pipes reciben argumentos
explícitos. Cambiar una signal actualiza la presentación sin reconstruir el
formulario. Un locale no determina una zona ni viceversa. `LocalDate` y
`LocalTime` carecen de zona; cambiarla no transforma esos valores.

Cada campo tiene su propio `DateAdapter` y `MAT_DATE_FORMATS`. Se usa
`DateAdapter.setLocale`, no un singleton mutable ni un parser regional propio.
El cambio de locale conserva el modelo, pristine/dirty y los borradores inválidos.
El cambio de zona representa el mismo instante; una edición posterior se
resuelve en la nueva zona. Los cambios que afectan a la validez se notifican
por la API estándar de validadores, no como una edición CVA.

Los widgets contienen `DateTime` de Luxon en UTC como soporte de **campos
civiles**. No son instantes de negocio ni salen del control. Esto evita que la
zona del navegador o sus transiciones DST alteren la fecha/hora editada.
La conversión con el dominio sigue pasando por `TimeFieldCodec` y los puertos
Time. El runtime de dominio también es `time-luxon`; sustituye completamente
al motor anterior, sin alias de compatibilidad ni implementación paralela.

## Qué se delega y qué se conserva

Material/Luxon se encarga del calendario, parsing por formatos regionales,
nombres, numeración, navegación y formateo de edición. Se usa `LuxonDateAdapter`
directamente, sin `RegionalDateAdapter`: aceptamos sus alternativas ISO, su
recuperación de entrada y las normalizaciones de Luxon (por ejemplo, 24:00).
UTC y calendario gregoriano se configuran mediante las opciones oficiales.
No se implementa otro parser, tokenizador, catálogo de locales ni motor de
calendario. Los locales con numeración no latina requieren verificar el
round-trip del adaptador oficial; ya no se promete una corrección propia.
El motor `time-luxon` delega también los huecos y ambigüedades DST en Luxon.
Las pruebas comparan ambos caminos para no reintroducir restricciones propias.
La adaptación de un instante a los campos visibles ya usa `DateTime.fromMillis`
con zona explícita: no calcula offsets ni reconstruye campos mediante cadenas ISO.

## Pipes frente a DatePipe

| Capacidad                        | Contrato                                                                                                   |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Alias y patrones de instantes    | Se delegan en DatePipe; comparación de los 12 alias y un patrón personalizado con es-ES/en-US              |
| Locale reactivo                  | Argumento explícito; fallback LOCALE_ID                                                                    |
| Formato por defecto de instantes | Se respeta DATE_PIPE_DEFAULT_OPTIONS.dateFormat; el default sin configuración es el de Angular             |
| Zona de instantes                | Zona explícita → contexto acuario → contexto usuario → UTC; IANA se resuelve al offset de cada instante    |
| Fecha/hora civil                 | Defaults mediumDate/mediumTime separados intencionadamente del default de instantes                        |
| Patrones civiles                 | Se rechazan partes inexistentes: una hora no puede mostrar la fecha de referencia ni una zona              |
| Valores ausentes                 | null/undefined producen cadena vacía; no se promete compatibilidad binaria con DatePipe, que devuelve null |
| Tipos de entrada                 | Valores y representaciones Time; no se amplía el dominio con Date o DateTime                               |
| Duraciones                       | ISO, digital, corto/largo y texto relativo son extensiones de Time; no son fechas                          |

Los tokens de los pipes son **Angular**; los formatos de edición Material/Luxon
son **Luxon**. No se pueden intercambiar arbitrariamente. Angular sigue siendo
responsable de DatePipe/i18n: Luxon no reemplaza esas APIs.

## Campos frente a Angular Forms y Material

| Grupo         | API disponible                                                                                                         |
| ------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Formularios   | CVA/Validator para FormControl/FormGroup y puente oficial de Signal Forms                                              |
| Estados       | required, readonly, disabled desde Forms, reset, focus, touched/dirty                                                  |
| Preferencias  | locale, timeZone y formats reactivos por instancia                                                                     |
| Restricciones | min/max Time inclusivos; se trasladan a inputs y selectores; límites horarios de un instante solo en sus días frontera |
| Filtros       | dateFilter sobre LocalDate, compartido por validación y calendario                                                     |
| Errores       | ErrorStateMatcher configurable; default Angular con touched o submit; mensaje personalizable                           |
| Textos        | label, dateLabel/timeLabel, placeholders, hint y errorText ya traducidos por el consumidor                             |
| Accesibilidad | inputId/name con sufijos date/clock; aria-label, labelledby y describedby diferenciados                                |
| Apariencia    | appearance, floatLabel, hideRequiredMarker, subscriptSizing; defaults Material cuando proceda                          |
| Calendario    | startAt, startView, touchUi, calendarHeaderComponent, dateClass                                                        |
| Overlays      | panelClass, xPosition/yPosition, restoreFocus, open/close/focus y eventos opened/closed                                |
| Hora          | interval o timeOptions con LocalTime y label; openOnClick, disableRipple                                               |
| Composición   | Proyección timeDatePrefix/timeDateSuffix/timeClockPrefix/timeClockSuffix                                               |

`options` agrupa personalización Material; `formats` acepta `MatDateFormats`
compatibles con Luxon. No se reemplaza el tema ni se introduce un motor de
formularios. Las opciones de hora y el intervalo son mutuamente excluyentes,
como exige Material.

El editor es escalar: no sustituye al selector de rangos de Material. Las
opciones privadas/deprecadas o sin significado para estos valores no forman
parte del contrato. Los eventos de edición del modelo se consumen mediante
Forms; no se exponen eventos con DateTime como API de negocio.

## Traducción de labels

El campo muestra el texto que recibe. Un label personalizado **no se traduce
automáticamente**: el consumidor usa `i18n-label` para un atributo literal o
`$localize` para mensajes declarados en TypeScript. Lo mismo se aplica a los
textos del objeto options. Véanse [ejemplos](forms.md).

Cambiar el locale regional en ejecución no cambia los mensajes ya compilados
por Angular i18n. La app gestiona el idioma de sus traducciones y registra los
datos Angular de los locales permitidos para los pipes. Intl/Luxon no sustituyen
`registerLocaleData`.

## Validación reproducible

```sh
NX_DAEMON=false pnpm nx run-many -p time -t lint,typecheck,test,build --skip-nx-cache
NX_DAEMON=false pnpm nx run time:browser-test --skip-nx-cache
```

La suite cubre parsing regional, formatos Angular, formularios, límites, filtros,
DST, cambios de locale y conservación de valores. El target browser-test monta
un fixture local sin Firebase y comprueba el código compilado con Chromium:
entrada regional, pipes reactivos, submit, teclado/foco, límites y Signal Forms.
No equivale a una certificación de todos los navegadores ni a la adopción
vertical en los formularios de Aquarium.

La cobertura no sustituye los contratos. La auditoría original detectó parsing
con Date.parse, defaults de DatePipe anulados y opciones Material inaccesibles;
esta implementación sustituye esos mecanismos, no documenta las carencias como
si estuvieran resueltas por la mera presencia de Angular/localize.
