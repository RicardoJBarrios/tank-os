import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormField, form, required, disabled } from '@angular/forms/signals';
import { createComponentFactory } from '@ngneat/spectator/vitest';
import { parseLocalTime, type LocalDate, type LocalTime } from '@tankos/time';
import { provideTimeAngularTestRuntime } from '../../../test-setup';
import { TimeField } from './time-field';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatDatepickerInputHarness } from '@angular/material/datepicker/testing';
import { MatTimepickerInputHarness } from '@angular/material/timepicker/testing';
const AFTERNOON_OPTION = /1:30\sPM/u;

// JSDOM has no layout/scroll implementation; Material's selection still runs.
beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
    configurable: true,
    value: vi.fn(),
  });
});
afterAll(() => {
  Reflect.deleteProperty(HTMLElement.prototype, 'scrollIntoView');
});

@Component({
  imports: [ReactiveFormsModule, TimeField],
  template: `<form [formGroup]="form">
    <tankos-time-field
      formControlName="date"
      [required]="isRequired()"
      [min]="min()"
      [max]="max()"
      [readonly]="readOnly()"
    />
  </form>`,
})
class ReactiveHost {
  public readonly form = new FormGroup({
    date: new FormControl<LocalDate | null>(null),
  });
  public readonly isRequired = signal(false);
  public readonly readOnly = signal(false);
  public readonly min = signal<LocalDate | undefined>(undefined);
  public readonly max = signal<LocalDate | undefined>(undefined);
}

@Component({
  imports: [FormField, TimeField],
  template: `<tankos-time-field
    [formField]="fields.clock"
    kind="local-time"
  />`,
})
class SignalHost {
  public readonly model = signal<{ clock: LocalTime | null }>({ clock: null });
  public readonly locked = signal(false);
  public readonly fields = form(this.model, (path) => {
    required(path.clock);
    disabled(path.clock, { when: () => this.locked() });
  });
}

describe('Material time field with FormGroup', () => {
  const create = createComponentFactory({
    component: ReactiveHost,
    providers: [provideTimeAngularTestRuntime()],
  });
  it('selects a date through the actual Material calendar overlay', async () => {
    const spectator = create();
    spectator.component.form.controls.date.setValue({
      kind: 'local-date',
      year: 2026,
      month: 6,
      day: 1,
    });
    spectator.detectChanges();
    const loader = TestbedHarnessEnvironment.loader(spectator.fixture);
    const input = await loader.getHarness(MatDatepickerInputHarness);
    await input.openCalendar();
    const calendar = await input.getCalendar();
    await calendar.selectCell({ text: '15' });
    expect(spectator.component.form.controls.date.value).toEqual({
      kind: 'local-date',
      year: 2026,
      month: 6,
      day: 15,
    });
  });
  it('edits domain dates, blurs, resets and writes without echoing', async () => {
    const spectator = create();
    const control = spectator.component.form.controls.date;
    const changes = vi.fn();
    control.valueChanges.subscribe(changes);
    spectator.typeInElement('6/1/2026', 'input');
    await spectator.fixture.whenStable();
    expect(control.value).toEqual({
      kind: 'local-date',
      year: 2026,
      month: 6,
      day: 1,
    });
    expect(control.dirty).toBe(true);
    spectator.blur('input');
    expect(control.touched).toBe(true);
    const value = {
      kind: 'local-date',
      year: 2024,
      month: 2,
      day: 29,
    } as const;
    changes.mockClear();
    control.setValue(value);
    spectator.detectChanges();
    expect(changes).toHaveBeenCalledExactlyOnceWith(value);
    expect(spectator.query<HTMLInputElement>('input')?.value).toContain('2024');
    spectator.component.form.reset();
    spectator.detectChanges();
    expect(control.value).toBeNull();
    expect(spectator.query<HTMLInputElement>('input')?.value).toBe('');
  });
  it('propagates required, malformed input and inclusive bounds', async () => {
    const spectator = create();
    spectator.component.isRequired.set(true);
    spectator.detectChanges();
    await spectator.fixture.whenStable();
    const control = spectator.component.form.controls.date;
    expect(control.hasError('required')).toBe(true);
    spectator.typeInElement('not a date', 'input');
    await spectator.fixture.whenStable();
    expect(control.invalid).toBe(true);
    spectator.component.min.set({
      kind: 'local-date',
      year: 2026,
      month: 6,
      day: 1,
    });
    spectator.component.max.set({
      kind: 'local-date',
      year: 2026,
      month: 6,
      day: 30,
    });
    spectator.detectChanges();
    spectator.typeInElement('5/31/2026', 'input');
    expect(control.hasError('timeMin')).toBe(true);
    spectator.typeInElement('7/1/2026', 'input');
    expect(control.hasError('timeMax')).toBe(true);
    spectator.typeInElement('6/1/2026', 'input');
    expect(control.valid).toBe(true);
  });
  it('honors disabled and readonly, renders Material and supports focus', () => {
    const spectator = create();
    const component = spectator.query(TimeField);
    if (!component) throw new Error('Expected TimeField');
    expect(spectator.query('mat-datepicker-toggle')).not.toBeNull();
    component.focus();
    expect(document.activeElement).toBe(spectator.query('input'));
    spectator.component.form.disable();
    spectator.detectChanges();
    expect(spectator.query<HTMLInputElement>('input')?.disabled).toBe(true);
    component.changed();
    expect(spectator.component.form.controls.date.value).toBeNull();
    spectator.component.form.enable();
    spectator.component.readOnly.set(true);
    spectator.detectChanges();
    expect(spectator.query<HTMLInputElement>('input')?.readOnly).toBe(true);
    component.changed();
    expect(spectator.component.form.controls.date.value).toBeNull();
  });
});

describe('same Material control with Signal Forms', () => {
  const create = createComponentFactory({
    component: SignalHost,
    providers: [provideTimeAngularTestRuntime()],
  });
  it('selects a clock value through the actual Material timepicker overlay', async () => {
    const spectator = create();
    const loader = TestbedHarnessEnvironment.loader(spectator.fixture);
    const input = await loader.getHarness(MatTimepickerInputHarness);
    const picker = await input.openTimepicker();
    await picker.selectOption({ text: AFTERNOON_OPTION });
    expect(spectator.component.model().clock).toEqual(parseLocalTime('13:30'));
  });
  it('binds the model, validation, blur and disabled state using Angular CVA interoperability', async () => {
    const spectator = create();
    await spectator.fixture.whenStable();
    expect(spectator.component.fields.clock().invalid()).toBe(true);
    expect(spectator.query('mat-timepicker-toggle')).not.toBeNull();
    spectator.typeInElement('1:30 PM', 'input');
    spectator.blur('input');
    await spectator.fixture.whenStable();
    expect(spectator.component.model().clock).toEqual(parseLocalTime('13:30'));
    expect(spectator.component.fields.clock().touched()).toBe(true);
    expect(spectator.component.fields.clock().valid()).toBe(true);
    const timeField = spectator.query(TimeField);
    if (!timeField) throw new Error('Expected TimeField');
    const write = vi.spyOn(timeField, 'writeValue');
    spectator.component.model.set({ clock: parseLocalTime('09:15') });
    spectator.detectChanges();
    await spectator.fixture.whenStable();
    expect(spectator.component.fields.clock().value()).toEqual(
      parseLocalTime('09:15'),
    );
    expect(write).toHaveBeenCalledWith(parseLocalTime('09:15'));
    expect(timeField.clockControl.value?.hour).toBe(9);
    expect(spectator.query<HTMLInputElement>('input')?.value).toContain('9:15');
    spectator.component.locked.set(true);
    spectator.detectChanges();
    await spectator.fixture.whenStable();
    expect(spectator.query<HTMLInputElement>('input')?.disabled).toBe(true);
  });
});
