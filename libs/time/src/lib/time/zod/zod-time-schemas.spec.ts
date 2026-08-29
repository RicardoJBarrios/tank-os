import type {
  CalendarPort,
  DurationPort,
  InstantPort,
  TimeZoneDatabasePort,
} from '../core';
import { createZodTimeSchemas } from './zod-time-schemas';

it('composes the independently tested canonical temporal schemas', () => {
  const port = {
    parseInstant: vi
      .fn()
      .mockReturnValue({ kind: 'instant', epochMilliseconds: 123 }),
    parseLocalDate: vi.fn().mockReturnValue({
      kind: 'local-date',
      year: 2026,
      month: 8,
      day: 20,
    }),
    parseDuration: vi
      .fn()
      .mockReturnValue({ kind: 'duration', milliseconds: 1_500 }),
  } as unknown as CalendarPort & DurationPort & InstantPort;
  const database = {
    isValid: vi.fn().mockReturnValue(true),
  } as unknown as TimeZoneDatabasePort;
  const schemas = createZodTimeSchemas(port, database);

  expect(schemas.instant.parse('instant')).toEqual({
    kind: 'instant',
    epochMilliseconds: 123,
  });
  expect(schemas.localDate.parse('2026-08-20')).toEqual({
    kind: 'local-date',
    year: 2026,
    month: 8,
    day: 20,
  });
  expect(schemas.duration.parse('PT1.5S')).toEqual({
    kind: 'duration',
    milliseconds: 1_500,
  });
  expect(schemas.timeZone.parse('Atlantic/Canary')).toBe('Atlantic/Canary');
});
