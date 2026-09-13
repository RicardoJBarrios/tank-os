import { Component, LOCALE_ID, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { createComponentFactory } from '@ngneat/spectator/vitest';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatDatepickerInputHarness } from '@angular/material/datepicker/testing';
import { parseLocalTime, type LocalDate } from '@tankos/time';
import { provideTimeAngularTestRuntime } from '../../../test-setup';
import { TimeField } from './time-field';

@Component({
  imports: [ReactiveFormsModule, TimeField],
  template: `<form [formGroup]="form">
    <tankos-time-field
      formControlName="date"
      [locale]="locale()"
      label="Inicio"
      inputId="start"
    />
    <tankos-time-field [formControl]="other" locale="en-US" />
  </form>`,
})
class RegionalHost {
  public readonly locale = signal('es-ES');
  public readonly form = new FormGroup({
    date: new FormControl<LocalDate | null>(null),
  });
  public readonly other = new FormControl<LocalDate | null>(null);
}

describe('per-field locale and Material controls', () => {
  const host = createComponentFactory({
    component: RegionalHost,
    providers: [provideTimeAngularTestRuntime()],
  });
  const create = createComponentFactory({
    component: TimeField,
    providers: [
      provideTimeAngularTestRuntime(),
      { provide: LOCALE_ID, useValue: 'es-ES' },
    ],
  });

  it('refreshes the default error state on parent form submission without requiring blur', () => {
    const spectator = host();
    spectator.component.form.controls.date.setValidators(Validators.required);
    spectator.component.form.controls.date.updateValueAndValidity();
    spectator.dispatchFakeEvent('form', 'submit');
    spectator.detectChanges();
    expect(spectator.query(TimeField)?.errorState.isErrorState()).toBe(true);
    expect(spectator.query('mat-error')).not.toBeNull();
  });

  it('keeps locales independent, reacts without changing the model and replaces the default label', async () => {
    const spectator = host();
    const inputs = spectator.queryAll<HTMLInputElement>('input');
    const first = inputs[0];
    const second = inputs[1];
    spectator.typeInElement('03/04/2026', first);
    spectator.typeInElement('03/04/2026', second);
    await spectator.fixture.whenStable();
    expect(spectator.component.form.controls.date.value).toEqual({
      kind: 'local-date',
      year: 2026,
      month: 4,
      day: 3,
    });
    expect(spectator.component.other.value?.month).toBe(3);
    expect(spectator.query('mat-label')?.textContent.trim()).toBe('Inicio');
    expect(first.id).toBe('start-date');
    const changes = vi.fn();
    spectator.component.form.controls.date.valueChanges.subscribe(changes);
    spectator.component.form.markAsPristine();
    spectator.component.locale.set('en-US');
    spectator.detectChanges();
    await spectator.fixture.whenStable();
    expect(first.value).toBe('4/3/2026');
    expect(changes).not.toHaveBeenCalled();
    expect(spectator.component.form.pristine).toBe(true);
  });

  it('retains invalid drafts and errors when locale changes', async () => {
    const spectator = host();
    const input = spectator.query<HTMLInputElement>('input');
    if (!input) throw new Error('Expected input');
    spectator.typeInElement('31/02/2026', input);
    await spectator.fixture.whenStable();
    expect(spectator.component.form.invalid).toBe(true);
    spectator.component.locale.set('en-US');
    spectator.detectChanges();
    await spectator.fixture.whenStable();
    expect(input.value).toBe('31/02/2026');
    expect(spectator.component.form.controls.date.hasError('timeParse')).toBe(
      true,
    );
    spectator.typeInElement('04/03/2026', input);
    expect(spectator.component.form.controls.date.valid).toBe(true);
  });

  it('falls back to LOCALE_ID and handles clock formatting without changing precision', () => {
    const spectator = create({ props: { kind: 'local-time' } });
    const value = parseLocalTime('13:30:45.123');
    const changed = vi.fn();
    spectator.component.registerOnChange(changed);
    spectator.component.writeValue(value);
    spectator.detectChanges();
    expect(spectator.query<HTMLInputElement>('input')?.value).toContain(
      '13:30',
    );
    spectator.setInput('locale', 'en-US');
    expect(spectator.query<HTMLInputElement>('input')?.value).toContain('PM');
    expect(spectator.component.clockControl.value?.millisecond).toBe(123);
    expect(changed).not.toHaveBeenCalled();
  });

  it('disables out-of-bounds calendar cells and applies custom field options', async () => {
    const spectator = create({
      props: {
        min: { kind: 'local-date', year: 2026, month: 4, day: 3 },
        max: { kind: 'local-date', year: 2026, month: 4, day: 20 },
        options: {
          startAt: { kind: 'local-date', year: 2026, month: 4, day: 3 },
          appearance: 'outline',
          datePlaceholder: 'dd/mm/aaaa',
          hint: 'Fecha civil',
          dateAriaLabel: 'Inicio del acuario',
        },
      },
    });
    const input = spectator.query<HTMLInputElement>('input');
    expect(input?.placeholder).toBe('dd/mm/aaaa');
    expect(input?.getAttribute('aria-label')).toBe('Inicio del acuario');
    expect(spectator.query('mat-hint')?.textContent).toBe('Fecha civil');
    const harness = await TestbedHarnessEnvironment.loader(
      spectator.fixture,
    ).getHarness(MatDatepickerInputHarness);
    await harness.openCalendar();
    const calendar = await harness.getCalendar();
    const cells = await calendar.getCells({ text: '2' });
    expect(await cells[0]?.isDisabled()).toBe(true);
    spectator.component.close();
  });
});
