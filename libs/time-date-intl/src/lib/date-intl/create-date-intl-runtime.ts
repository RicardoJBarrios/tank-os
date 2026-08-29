import type {
  ClockPort,
  TimeRuntime,
  TimeZoneDatabasePort,
} from '@tankos/time';
import { createDateIntlClock } from './create-date-intl-clock';
import { createDateIntlTimeAdapter } from './create-date-intl-time-adapter';
import { createDateIntlTimeZoneDatabase } from './create-date-intl-time-zone-database';

/** Optional replacements used while assembling the Date/Intl runtime. */
export interface DateIntlRuntimeOptions {
  readonly clock?: ClockPort;
  readonly timeZoneDatabase?: TimeZoneDatabasePort;
}

/**
 * Creates the complete Date/Intl runtime consumed by composition roots.
 *
 * @param options - Optional clock and IANA database replacements.
 * @returns A coherent runtime whose time port and presentation share one TZDB.
 */
export function createDateIntlRuntime(
  options: DateIntlRuntimeOptions = {},
): TimeRuntime {
  const timeZoneDatabase =
    options.timeZoneDatabase ?? createDateIntlTimeZoneDatabase();
  return {
    clock: options.clock ?? createDateIntlClock(),
    timePort: createDateIntlTimeAdapter(timeZoneDatabase),
    timeZoneDatabase,
  };
}
