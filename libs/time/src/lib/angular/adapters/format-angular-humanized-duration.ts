import { DurationInput, TimePort } from '@tankos/time';
import { HumanizeDurationOptions } from '../contracts';
import { formatRelativeDuration } from './format-relative-duration';

/** Normalizes and humanizes a duration for Angular presentation. */
export function formatAngularHumanizedDuration(
  timePort: TimePort,
  defaultLocale: string,
  value: DurationInput,
  options?: HumanizeDurationOptions,
): string {
  return formatRelativeDuration(
    timePort.parseDuration(value).milliseconds,
    options?.locale ?? defaultLocale,
    options?.calendarUnits ?? 'none',
  );
}
