import type { TimeZoneDatabasePort } from '../core';
import { createZodTimeZoneSchema } from './create-zod-time-zone-schema';

describe('createZodTimeZoneSchema', () => {
  const database = {
    isValid: vi.fn((value: string) => value === 'Atlantic/Canary'),
  } as unknown as TimeZoneDatabasePort;

  it('accepts a recognized IANA identifier', () => {
    expect(createZodTimeZoneSchema(database).parse('Atlantic/Canary')).toBe(
      'Atlantic/Canary',
    );
  });

  it.each(['', 'Not/AZone'])('rejects unknown string %s', (value) => {
    expect(createZodTimeZoneSchema(database).safeParse(value).success).toBe(
      false,
    );
  });

  it.each([null, undefined, 25])('rejects non-string input %s', (value) => {
    expect(createZodTimeZoneSchema(database).safeParse(value).success).toBe(
      false,
    );
  });
});
