import type {
  MatFormFieldAppearance,
  FloatLabelType,
  SubscriptSizing,
} from '@angular/material/form-field';
import type { LocalDate, LocalTime } from '@tankos/time';
import type { ComponentType } from '@angular/cdk/portal';

/** Material presentation options; texts are already translated by the consumer. */
export interface TimeFieldOptions {
  readonly appearance?: MatFormFieldAppearance;
  readonly floatLabel?: FloatLabelType;
  readonly hideRequiredMarker?: boolean;
  readonly subscriptSizing?: SubscriptSizing;
  readonly dateLabel?: string;
  readonly timeLabel?: string;
  readonly datePlaceholder?: string;
  readonly timePlaceholder?: string;
  readonly hint?: string;
  readonly errorText?: string;
  readonly dateAriaLabel?: string;
  readonly timeAriaLabel?: string;
  readonly dateLabelledBy?: string;
  readonly timeLabelledBy?: string;
  readonly describedBy?: string;
  readonly startAt?: LocalDate;
  readonly calendarHeaderComponent?: ComponentType<unknown>;
  readonly startView?: 'month' | 'year' | 'multi-year';
  readonly touchUi?: boolean;
  readonly restoreFocus?: boolean;
  readonly panelClass?: string | string[];
  readonly xPosition?: 'start' | 'end';
  readonly yPosition?: 'above' | 'below';
  readonly dateClass?: (
    date: LocalDate,
    view: 'month' | 'year' | 'multi-year',
  ) => string | string[];
  readonly interval?: number | string;
  readonly timeOptions?: readonly {
    readonly value: LocalTime;
    readonly label: string;
  }[];
  readonly openOnClick?: boolean;
  readonly disableRipple?: boolean;
}
