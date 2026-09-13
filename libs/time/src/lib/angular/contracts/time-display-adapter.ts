import type { DurationInput, InstantInput, LocalDateInput } from '@tankos/time';
import type { DurationDisplayOptions } from './duration-display-options';
import type { HumanizeDurationOptions } from './humanize-duration-options';

/** Options shared by time presentation operations. */
export type TimeDisplayOptions = Readonly<{
  /** Angular-compatible date format, such as `medium` or `fullDate`. */
  format?: string;
  /** Locale override passed to the final display formatter. */
  locale?: string;
  /** Explicit presentation zone; it does not alter the stored value. */
  timeZone?: string;
}>;

/** Options for a calendar date, which deliberately has no time zone. */
export type LocalDateDisplayOptions = Readonly<{
  /** Angular-compatible date format, such as `mediumDate` or `fullDate`. */
  format?: string;
  /** Locale override passed to Angular's final display formatter. */
  locale?: string;
}>;

/**
 * Port for rendering temporal values for users.
 *
 * @remarks Presentation code depends on this contract rather than on a
 * concrete date-time runtime or formatting API.
 */
export interface TimeDisplayAdapter {
  formatInstant(value: InstantInput, options?: TimeDisplayOptions): string;
  formatLocalDate(
    value: LocalDateInput,
    options?: LocalDateDisplayOptions,
  ): string;
  formatDuration(
    value: DurationInput,
    options?: DurationDisplayOptions,
  ): string;
  /** Formats an elapsed duration as localized relative text. */
  formatHumanizedDuration(
    value: DurationInput,
    options?: HumanizeDurationOptions,
  ): string;
}
