import '@angular/compiler';
import '@angular/localize/init';
import '@angular/material/prebuilt-themes/azure-blue.css';
import { Component, signal } from '@angular/core';
import { JsonPipe, registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { bootstrapApplication } from '@angular/platform-browser';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormField, form } from '@angular/forms/signals';
import {
  TimeField,
  LocalDatePipe,
  provideTimeAngular,
} from '@tankos/time/angular';
import { createLuxonRuntime } from '@tankos/time-luxon';

registerLocaleData(es);

class TimeTestHost {
  locale = signal('es-ES');
  edits = signal(0);
  zone = signal('UTC');
  instant = new FormControl({ kind: 'instant', epochMilliseconds: 0 });
  instantEdits = signal(0);
  form = new FormGroup({ date: new FormControl(null) });
  model = signal({ clock: null });
  fields = form(this.model);
  min = { kind: 'local-date', year: 2026, month: 4, day: 3 };
  max = { kind: 'local-date', year: 2026, month: 4, day: 20 };
  options = { startAt: this.min, appearance: 'outline' };
  constructor() {
    this.instant.valueChanges.subscribe(() =>
      this.instantEdits.update((value) => value + 1),
    );
    this.form.controls.date.valueChanges.subscribe(() =>
      this.edits.update((value) => value + 1),
    );
  }
}

Component({
  selector: 'time-test-host',
  imports: [ReactiveFormsModule, FormField, TimeField, JsonPipe, LocalDatePipe],
  template: `<h1>Contrato regional de Time</h1>
    <form [formGroup]="form">
      <tankos-time-field formControlName="date" inputId="start" label="Inicio" i18n-label="@@test.start"
        [locale]="locale()" [min]="min" [max]="max" [required]="true" [options]="options" />
      <button type="submit">Validar</button>
    </form>
    <tankos-time-field [formField]="fields.clock" inputId="clock" label="Hora de alimentación" i18n-label="@@test.clock"
      kind="local-time" [locale]="locale()" />
    <button type="button" (click)="locale.set('en-US')">English formats</button>
    <tankos-time-field [formControl]="instant" kind="instant" inputId="instant" label="Observación"
      [locale]="locale()" [timeZone]="zone()" />
    <button type="button" (click)="zone.set('Asia/Kolkata')">Cambiar zona</button>
    <output id="instant-edits">{{ instantEdits() }}</output>
    <pre id="instant-value">{{ instant.value | json }}</pre>
    <pre id="date-value">{{ form.controls.date.value | json }}</pre>
    <pre id="clock-value">{{ model().clock | json }}</pre>
    <output id="edits">{{ edits() }}</output>
    <output id="formatted">{{ form.controls.date.value | tankLocalDate:'fullDate':locale() }}</output>`,
})(TimeTestHost);

await bootstrapApplication(TimeTestHost, {
  providers: [provideTimeAngular(createLuxonRuntime())],
});
