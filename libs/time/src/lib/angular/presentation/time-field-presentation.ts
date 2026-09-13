import { DateTime } from 'luxon';
import {
  Directive,
  ChangeDetectorRef,
  Injector,
  computed,
  effect,
  inject,
  input,
  signal,
  viewChild,
  untracked,
  ElementRef,
  LOCALE_ID,
  output,
} from '@angular/core';
import {
  FormControl,
  NgControl,
  FormGroupDirective,
  NgForm,
} from '@angular/forms';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatDatepicker, MatCalendarHeader } from '@angular/material/datepicker';
import {
  MatTimepicker,
  MAT_TIMEPICKER_CONFIG,
} from '@angular/material/timepicker';
import {
  DateAdapter,
  ErrorStateMatcher,
  MAT_DATE_FORMATS,
} from '@angular/material/core';
import type { LocalDate } from '@tankos/time';
import type { TimeFieldOptions } from './time-field-options';
import type { MatDateFormats } from '@angular/material/core';
import { createTimeMaterialFormats } from './time-material-formats';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TIME_PORT } from '../application/time-tokens';
import {
  TimeFieldCodec,
  type TimeFieldKind,
  type TimeFieldValue,
} from './time-field-codec';

/** Internal Material presentation and locale state shared by the single Time editor. */
@Directive()
export class TimeFieldPresentation {
  public readonly defaultCalendarHeader = MatCalendarHeader;
  public readonly kind = input<TimeFieldKind>('local-date');
  public readonly label = input('');
  public readonly locale = input<string>();
  public readonly formats = input<MatDateFormats>();
  public readonly options = input<TimeFieldOptions>({});
  public readonly dateFilter = input<(date: LocalDate) => boolean>();
  public readonly errorStateMatcher = input<ErrorStateMatcher>();
  public readonly inputId = input('');
  public readonly name = input('');
  public readonly opened = output<'date' | 'clock'>();
  public readonly closed = output<'date' | 'clock'>();
  public readonly defaults = inject(MAT_FORM_FIELD_DEFAULT_OPTIONS, {
    optional: true,
  });
  public readonly clockDefaults = inject(MAT_TIMEPICKER_CONFIG, {
    optional: true,
  });
  public readonly timeZone = input('');
  public readonly required = input(false);
  public readonly readonly = input(false);
  public readonly min = input<TimeFieldValue>();
  public readonly max = input<TimeFieldValue>();
  public readonly dateControl = new FormControl<DateTime | null>(null);
  public readonly clockControl = new FormControl<DateTime | null>(null);
  public readonly isDisabled = signal(false);
  public readonly errorState = {
    isErrorState: () => {
      const control = this.#injector.get(NgControl, null, { self: true });
      const parent =
        this.#injector.get(FormGroupDirective, null) ??
        this.#injector.get(NgForm, null);
      return (
        this.errorStateMatcher() ?? this.#defaultErrorMatcher
      ).isErrorState((control?.control ?? null) as FormControl | null, parent);
    },
  };
  public readonly calendarFilter = computed(() => {
    const filter = this.dateFilter();
    return (value: DateTime | null): boolean => {
      if (!value) return true;
      const date = this.codec.fromMaterial(
        value,
        null,
        'local-date',
        '',
      ) as LocalDate;
      return filter?.(date) ?? true;
    };
  });

  public readonly calendarClass = computed(() => {
    const dateClass = this.options().dateClass;
    return (
      value: DateTime,
      view: 'month' | 'year' | 'multi-year',
    ): string | string[] => {
      const date = this.codec.fromMaterial(
        value,
        null,
        'local-date',
        '',
      ) as LocalDate;
      return dateClass?.(date, view) ?? '';
    };
  });

  public readonly clockOptions = computed(
    () =>
      this.options().timeOptions?.map((option) => ({
        value: this.codec.toMaterial(option.value, 'local-time', ''),
        label: option.label,
      })) ?? null,
  );

  protected readonly codec = new TimeFieldCodec(inject(TIME_PORT));
  protected readonly dateInput =
    viewChild<ElementRef<HTMLInputElement>>('dateInput');
  protected readonly clockInput =
    viewChild<ElementRef<HTMLInputElement>>('clockInput');

  protected parseError = false;
  protected refreshing = false;
  readonly #injector = inject(Injector);
  readonly #adapter = inject<DateAdapter<DateTime>>(DateAdapter);
  readonly #formats = inject(MAT_DATE_FORMATS);
  readonly #fallbackLocale = inject(LOCALE_ID);
  readonly #defaultErrorMatcher = inject(ErrorStateMatcher);
  private readonly calendar = viewChild<MatDatepicker<DateTime>>('calendar');
  private readonly picker = viewChild<MatTimepicker<DateTime>>('picker');

  public constructor() {
    const parent =
      inject(FormGroupDirective, { optional: true }) ??
      inject(NgForm, { optional: true });
    const changeDetector = inject(ChangeDetectorRef);
    parent?.ngSubmit.pipe(takeUntilDestroyed()).subscribe(() => {
      changeDetector.markForCheck();
    });
    effect(() => {
      const locale = this.locale() ?? this.#fallbackLocale;
      const formats = this.formats() ?? createTimeMaterialFormats();
      untracked(() => {
        this.refreshing = true;
        try {
          Object.assign(this.#formats.parse, formats.parse);
          Object.assign(this.#formats.display, formats.display);
          this.updateLocale(locale);
        } finally {
          this.refreshing = false;
        }
      });
    });
  }

  /** For programmatic focus and accessible validation journeys. */
  public focus(options?: FocusOptions): void {
    (this.dateInput() ?? this.clockInput())?.nativeElement.focus(options);
  }

  /** Opens the chosen Material overlay unless editing is blocked. */
  public open(part: 'date' | 'clock' = 'date'): void {
    if (this.isDisabled() || this.readonly()) return;
    if (part === 'date') this.calendar()?.open();
    else this.picker()?.open();
  }

  /** Closes both overlays, retaining Material's focus restoration. */
  public close(): void {
    this.calendar()?.close();
    this.picker()?.close();
  }

  /** Adapts a civil date for calendar configuration without exposing DateTime to callers. */
  public calendarDate(value: LocalDate | undefined): DateTime | null {
    return value ? this.codec.toMaterial(value, 'local-date', '') : null;
  }

  /** Material bounds use civil days; clock limits apply only on instant boundary days. */
  public materialBound(
    direction: 'min' | 'max',
    part: 'date' | 'clock',
  ): DateTime | null {
    const bound = direction === 'min' ? this.min() : this.max();
    if (!bound) return null;
    try {
      const date = this.codec.toMaterial(
        bound,
        this.kind(),
        this.timeZone(),
        part,
      );
      if (this.unboundedClockDay(bound, part)) return null;
      return date;
    } catch {
      return null;
    }
  }

  private updateLocale(locale: string): void {
    const invalid = this.parseError;
    const inputs = [
      this.dateInput()?.nativeElement,
      this.clockInput()?.nativeElement,
    ];
    const drafts = inputs.flatMap((element) =>
      element ? [{ element, value: element.value }] : [],
    );
    const errors = [this.dateControl.errors, this.clockControl.errors];
    this.#adapter.setLocale(locale);
    this.parseError = invalid;
    if (!invalid) {
      this.refreshClock();
      return;
    }
    for (const draft of drafts) draft.element.value = draft.value;
    this.dateControl.setErrors(errors[0], { emitEvent: false });
    this.clockControl.setErrors(errors[1], { emitEvent: false });
  }

  private refreshClock(): void {
    const clock = this.clockControl.value;
    const element = this.clockInput()?.nativeElement;
    if (clock && element)
      element.value = this.#adapter.format(
        clock,
        this.#formats.display.timeInput,
      );
  }

  private unboundedClockDay(
    bound: TimeFieldValue,
    part: 'date' | 'clock',
  ): boolean {
    if (part !== 'clock' || this.kind() !== 'instant') return false;
    const day = this.codec.toMaterial(bound, this.kind(), this.timeZone());
    return !this.#adapter.sameDate(day, this.dateControl.value);
  }
}
