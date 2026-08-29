import { selectApproximateCalendarUnit } from './select-approximate-calendar-unit';
import { selectRelativeDurationUnit } from './select-relative-duration-unit';

/** Formats signed milliseconds as localized relative text. */
export function formatRelativeDuration(
  milliseconds: number,
  locale: string,
  calendarUnits: 'none' | 'approximate',
): string {
  const absolute = Math.abs(milliseconds);
  const selected =
    calendarUnits === 'approximate'
      ? (selectApproximateCalendarUnit(absolute) ??
        selectRelativeDurationUnit(absolute))
      : selectRelativeDurationUnit(absolute);
  return new Intl.RelativeTimeFormat(locale, {
    numeric: 'auto',
    style: 'long',
  }).format(Math.round(milliseconds / selected[1]), selected[0]);
}
