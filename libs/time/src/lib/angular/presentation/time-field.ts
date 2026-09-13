import type { DateTime } from 'luxon';
import {
  Component,
  computed,
  effect,
  forwardRef,
  untracked,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MatDatepickerModule,
  MatDatepickerIntl,
} from '@angular/material/datepicker';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import {
  provideLuxonDateAdapter,
  MAT_LUXON_DATE_ADAPTER_OPTIONS,
} from '@angular/material-luxon-adapter';
import { createTimeMaterialFormats } from './time-material-formats';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { createTimeDatepickerIntl } from './create-time-datepicker-intl';
import { TimeFieldPresentation } from './time-field-presentation';
import type { TimeFieldValue } from './time-field-codec';

@Component({
  selector: 'tankos-time-field',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatTimepickerModule,
  ],
  providers: [
    provideLuxonDateAdapter(),
    { provide: MAT_DATE_FORMATS, useFactory: createTimeMaterialFormats },
    {
      provide: MAT_LUXON_DATE_ADAPTER_OPTIONS,
      useValue: { useUtc: true, defaultOutputCalendar: 'gregory' },
    },
    { provide: MatDatepickerIntl, useFactory: createTimeDatepickerIntl },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimeField),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => TimeField),
      multi: true,
    },
  ],
  templateUrl: './time-field.html',
  styles: `
    :host {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }
    mat-form-field {
      flex: 1;
      min-width: 12rem;
    }
  `,
})
/** Material editor compatible with reactive forms and Signal Forms' CVA bridge. */
export class TimeField
  extends TimeFieldPresentation
  implements ControlValueAccessor, Validator
{
  readonly #settings = computed(() => ({
    kind: this.kind(),
    zone: this.timeZone(),
  }));
  #value: TimeFieldValue | null = null;
  #onChange: ((value: TimeFieldValue | null) => void) | undefined;
  #onTouched: (() => void) | undefined;
  #onValidatorChange: (() => void) | undefined;

  public constructor() {
    super();
    effect(() => {
      this.applyDisabled(this.isDisabled() || this.readonly());
    });
    for (const control of [this.dateControl, this.clockControl]) {
      control.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
        this.changed();
      });
    }
    effect(() => {
      this.#settings();
      const invalidBefore = this.parseError;
      untracked(() => {
        this.writeValue(this.#value);
      });
      const hasDateFilter = untracked(this.dateFilter) !== undefined;
      if (hasDateFilter || invalidBefore !== this.parseError)
        untracked(() => this.#onValidatorChange?.());
    });
    effect(() => {
      this.min();
      this.max();
      this.required();
      this.dateFilter();
      untracked(() => this.#onValidatorChange?.());
    });
  }

  /** Writes from either forms API without emitting a user edit. */
  public writeValue(value: TimeFieldValue | null): void {
    this.#value = value;
    this.parseError = false;
    let date: DateTime | null = null;
    let clock: DateTime | null = null;
    try {
      if (value) {
        date = this.codec.toMaterial(value, this.kind(), this.timeZone());
        clock = this.codec.toMaterial(
          value,
          this.kind(),
          this.timeZone(),
          'clock',
        );
      }
    } catch {
      this.parseError = true;
    }
    this.dateControl.setValue(date, { emitEvent: false });
    this.clockControl.setValue(clock, { emitEvent: false });
  }

  /** Registers Angular's model callback. */
  public registerOnChange(
    callback: (value: TimeFieldValue | null) => void,
  ): void {
    this.#onChange = callback;
  }
  /** Registers Angular's blur callback. */
  public registerOnTouched(callback: () => void): void {
    this.#onTouched = callback;
  }
  /** Registers validation updates when inputs or parsing change. */
  public registerOnValidatorChange(callback: () => void): void {
    this.#onValidatorChange = callback;
  }
  /** Applies the form's disabled state to both Material widgets. */
  public setDisabledState(disabled: boolean): void {
    this.isDisabled.set(disabled);
    this.applyDisabled(disabled || this.readonly());
  }

  /** Emits only Time values, including null for empty or invalid drafts. */
  public changed(): void {
    const editingBlocked =
      this.refreshing || this.isDisabled() || this.readonly();
    if (editingBlocked) return;
    this.parseError =
      this.dateControl.hasError('matDatepickerParse') ||
      this.clockControl.hasError('matTimepickerParse');
    try {
      this.#value = this.codec.fromMaterial(
        this.dateControl.value,
        this.clockControl.value,
        this.kind(),
        this.timeZone(),
      );
    } catch {
      this.parseError = true;
      this.#value = null;
    }
    this.#onChange?.(this.#value);
    this.#onValidatorChange?.();
  }

  /** Marks a field touched only after leaving an input. */
  public markTouched(): void {
    this.#onTouched?.();
  }
  /** Supplies the same parse/required/bounds errors to both Angular forms APIs. */
  public validate(
    control: AbstractControl<TimeFieldValue | null>,
  ): ValidationErrors | null {
    if (this.parseError) return { timeParse: true };
    const value = control.value;
    if (!value) return this.requiredError();
    try {
      this.codec.toMaterial(value, this.kind(), this.timeZone());
      const min = this.min();
      const max = this.max();
      if (this.outOfBounds(value, min, 'min')) return { timeMin: true };
      if (this.outOfBounds(value, max, 'max')) return { timeMax: true };
      if (
        value.kind !== 'local-time' &&
        !this.calendarFilter()(
          this.codec.toMaterial(value, this.kind(), this.timeZone()),
        )
      )
        return { timeFilter: true };
      return null;
    } catch {
      return { timeParse: true };
    }
  }

  private requiredError(): ValidationErrors | null {
    return this.required() ? { required: true } : null;
  }

  private applyDisabled(disabled: boolean): void {
    untracked(() => {
      for (const control of [this.dateControl, this.clockControl]) {
        if (disabled) control.disable({ emitEvent: false });
        else control.enable({ emitEvent: false });
      }
    });
  }

  private outOfBounds(
    value: TimeFieldValue,
    bound: TimeFieldValue | undefined,
    direction: 'min' | 'max',
  ): boolean {
    if (!bound) return false;
    this.codec.toMaterial(bound, this.kind(), this.timeZone());
    const difference =
      this.codec.magnitude(value) - this.codec.magnitude(bound);
    return direction === 'min' ? difference < 0 : difference > 0;
  }
}
