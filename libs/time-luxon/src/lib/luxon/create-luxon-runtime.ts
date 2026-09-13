import type {
  ClockPort,
  TimeRuntime,
  TimeZoneDatabasePort,
} from '@tankos/time';
import { createLuxonClock } from './create-luxon-clock';
import { createLuxonTimeAdapter } from './create-luxon-time-adapter';
import { createLuxonTimeZoneDatabase } from './create-luxon-time-zone-database';

/** Optional replacements used while assembling the Luxon runtime. */
export interface LuxonRuntimeOptions {
  readonly clock?: ClockPort;
  readonly timeZoneDatabase?: TimeZoneDatabasePort;
}

/**
 * Creates the complete Luxon runtime consumed by composition roots.
 *
 * @param options - Optional clock and IANA database replacements.
 * @returns A coherent runtime whose time port and presentation share one TZDB.
 */
export function createLuxonRuntime(
  options: LuxonRuntimeOptions = {},
): TimeRuntime {
  const timeZoneDatabase =
    options.timeZoneDatabase ?? createLuxonTimeZoneDatabase();
  return {
    clock: options.clock ?? createLuxonClock(),
    timePort: createLuxonTimeAdapter(timeZoneDatabase),
    timeZoneDatabase,
  };
}
