import { z } from 'zod';
import type {
  CalendarPort,
  DurationPort,
  InstantPort,
  TimeZoneDatabasePort,
} from '../core';
import type { Duration, Instant, LocalDate, LocalTime } from '../core';
import { createZodLocalTimeSchema } from './create-zod-local-time-schema';
import { createZodDurationSchema } from './create-zod-duration-schema';
import { createZodInstantSchema } from './create-zod-instant-schema';
import { createZodLocalDateSchema } from './create-zod-local-date-schema';
import { createZodTimeZoneSchema } from './create-zod-time-zone-schema';

/** Zod schemas for canonical JSON/HTTP temporal strings. */
export interface ZodTimeSchemas {
  /** Parses a civil clock string, without inventing a date or zone. */
  readonly localTime: z.ZodType<LocalTime>;
  /** Parses a canonical or supported ISO instant into an Instant. */
  readonly instant: z.ZodType<Instant>;
  /** Parses a YYYY-MM-DD calendar string into a LocalDate. */
  readonly localDate: z.ZodType<LocalDate>;
  /** Parses an ISO 8601 duration into a millisecond Duration. */
  readonly duration: z.ZodType<Duration>;
  /** Validates an IANA time-zone identifier. */
  readonly timeZone: z.ZodType<string>;
}

/**
 * Creates Zod schemas backed by the active Time ports.
 *
 * @param timePort - Calendar, duration and instant parser port.
 * @param timeZoneDatabase - IANA time-zone database port.
 * @returns Schemas that validate and map external strings into Time values.
 */
export function createZodTimeSchemas(
  timePort: CalendarPort & DurationPort & InstantPort,
  timeZoneDatabase: TimeZoneDatabasePort,
): ZodTimeSchemas {
  return {
    localTime: createZodLocalTimeSchema(),
    instant: createZodInstantSchema(timePort),
    localDate: createZodLocalDateSchema(timePort),
    duration: createZodDurationSchema(timePort),
    timeZone: createZodTimeZoneSchema(timeZoneDatabase),
  };
}
