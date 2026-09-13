# Formularios Angular con Material

`TimeField` (`tankos-time-field`) es standalone. Importarlo desde
`@tankos/time/angular`. Usa `mat-form-field`, `mat-datepicker` y
`mat-timepicker`, con sus overlays y navegación de teclado. No introduce un
motor de formularios dinámicos ni abstrae Material.

## Contrato

| `kind`                     | Valor del formulario | UI                                          |
| -------------------------- | -------------------- | ------------------------------------------- |
| `local-date` (por defecto) | `LocalDate \| null`  | Calendario                                  |
| `local-time`               | `LocalTime \| null`  | Selector de hora                            |
| `instant`                  | `Instant \| null`    | Calendario y hora, con `timeZone` explícita |

Entradas: `label`, `required`, `readonly`, `min`, `max`, `timeZone`, `kind`,
`locale`, `formats`, `options`, `dateFilter`, `errorStateMatcher`, `inputId` y `name`.
Los límites son inclusivos y deben tener el mismo tipo que el valor. El estado
deshabilitado se controla desde la API de formularios. La forma nativa de CVA
no verifica el tipo en la plantilla: declarar controles tipados y usar el
`kind` correspondiente; la validación en ejecución rechaza discrepancias.

`readonly` bloquea los widgets Material, incluidos sus atajos de teclado, sin
deshabilitar ni excluir el valor del formulario padre.

El componente implementa `ControlValueAccessor` y `Validator`. Angular Signal
Forms admite este contrato mediante su puente oficial de interoperabilidad;
no es un segundo componente ni una segunda fuente de verdad con `model()`.
No combinar `[formField]` y `[formControl]` en la misma instancia.

## Reactive Forms

```ts
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TimeField } from '@tankos/time/angular';
import type { LocalDate, Instant } from '@tankos/time';

// En un componente standalone con imports: [ReactiveFormsModule, TimeField]
readonly form = new FormGroup({
  date: new FormControl<LocalDate | null>(null),
  occurredAt: new FormControl<Instant | null>(null),
});
```

```html
<form [formGroup]="form">
  <tankos-time-field formControlName="date" label="Inicio" [required]="true" />
  <tankos-time-field formControlName="occurredAt" kind="instant" label="Observación" timeZone="Atlantic/Canary" />
</form>
```

También admite `[formControl]`. `setValue`, `reset`, `disable`, `enable`,
`dirty`, `touched` y los validadores siguen el contrato de Angular.

## Signal Forms

```ts
import { signal } from '@angular/core';
import { form, FormField, required } from '@angular/forms/signals';
import { TimeField } from '@tankos/time/angular';
import type { LocalTime } from '@tankos/time';

// En un componente standalone con imports: [FormField, TimeField]
readonly model = signal<{ clock: LocalTime | null }>({ clock: null });
readonly fields = form(this.model, (path) => required(path.clock));
```

```html
<tankos-time-field [formField]="fields.clock" kind="local-time" label="Hora" />
```

Signal Forms transmite el valor, las restricciones compatibles y el estado al
CVA. Los errores del validador se propagan por el mismo puente. Para límites
temporales usar `[min]`/`[max]` con valores Time, no restricciones numéricas.

## Semántica y errores

`null` significa vacío. Un borrador inválido mantiene un error `timeParse`;
los límites producen `timeMin`/`timeMax`, y vacío obligatorio `required`.
No guardar mientras el formulario sea inválido. Los errores se presentan
después de tocar el campo o enviar el formulario, con `mat-error`; `focus()` permite enfocar la edición.

Un instante exige una zona IANA; no toma implícitamente la zona del navegador.
Las horas inexistentes o repetidas en cambios DST se resuelven con los defaults
de Luxon, sin rechazo adicional de Time. Un valor externo
ya resuelto puede mostrarse sin volver a resolverlo ni emitir una modificación.
Cambiar de zona modifica su representación, no el instante.

La hora no es una duración: el selector no sirve para editar tiempo transcurrido.
Los valores conservan milisegundos al escribir desde el modelo; elegir una
opción de hora en Material utiliza la precisión de esa opción. El calendario
y el reloj usan `DateTime` de Luxon solo como representación interna de los widgets.

## Localización y composición

La app configura `provideTimeAngular(createLuxonRuntime())`, su tema Material
y `LOCALE_ID`. Los labels de dominio pertenecen al consumidor; los textos del
control usan Angular i18n. La app inicializa `@angular/localize/init` cuando
ejecuta mensajes sin traducción compilada, como en las pruebas JIT.
La página pasa el locale del usuario y la zona del contexto mediante signals.
`locale` cae en `LOCALE_ID` si se omite; un instante requiere `timeZone` explícita.
El adaptador oficial Material/Luxon interpreta la entrada regional directamente,
incluidas sus alternativas ISO y normalizaciones. No hay un parser específico
de Time ni validación adicional de los tokens de entrada. Las cadenas de
transporte canónicas siguen siendo responsabilidad de Zod/Time.

```html
<tankos-time-field [formControl]="form.controls.occurredAt" kind="instant" [locale]="userLocale()" [timeZone]="displayTimeZone()" label="Observación" i18n-label="@@observation.dateTime" />
```

Cambiar cualquiera de las signals actualiza la representación, no el instante.
No hace falta recrear el formulario ni cambiar providers globales. Para datos
regionales de DatePipe, la app registra sus locales Angular permitidos.

## Labels y opciones Material

Un label literal se traduce con `i18n-label`, como arriba. Un label calculado se
declara con `$localize` en TypeScript y se pasa mediante `[label]`:

```ts
readonly dateLabel = $localize`:@@aquarium.startedOn:Fecha de inicio`;
readonly timeOptions = {
  appearance: 'outline',
  dateLabel: $localize`:@@observation.date:Fecha de observación`,
  timeLabel: $localize`:@@observation.time:Hora de observación`,
  hint: $localize`:@@observation.hint:Usa la zona indicada`,
} as const;
```

El campo **no traduce cadenas arbitrarias**. Un label personalizado sustituye
al label predeterminado, no añade automáticamente «Fecha» o «Hora». En un
instante, `options.dateLabel` y `options.timeLabel` permiten diferenciarlos.
Cambiar el locale de formato no cambia los mensajes compilados por Angular.

`options` expone personalización tipada de Material: apariencia, hints/errores,
accesibilidad, vistas de calendario, filtros visuales, overlays e intervalos u
opciones de hora. `formats` recibe un `MatDateFormats` con tokens de **Luxon**;
los pipes conservan tokens de **Angular DatePipe**. Los defaults de edición son
`D` para fecha y `t` para hora; para mostrar milisegundos se puede configurar
`display.timeInput: 'HH:mm:ss.SSS'` junto con el resto de formatos Material.
Reemplazar el objeto de configuración al cambiarlo, no mutarlo en el sitio.

Véase la [matriz de paridad](localization-audit.md) para la API completa,
diferencias semánticas y pruebas reproducibles.

No añadir zonas, reglas o formularios de Aquarium a este componente. La migración
de sus campos existentes es un trabajo vertical distinto.
