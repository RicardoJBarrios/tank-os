import type { CalendarPort } from '../core';
import { createZodLocalDateSchema } from './create-zod-local-date-schema';

describe('createZodLocalDateSchema', () => {
  it('maps an external string through the configured calendar parser', () => {
    const port = {
      parseLocalDate: vi.fn().mockReturnValue({
        kind: 'local-date',
        year: 2026,
        month: 8,
        day: 20,
      }),
    } as unknown as CalendarPort;
    expect(createZodLocalDateSchema(port).parse('2026-08-20')).toEqual({
      kind: 'local-date',
      year: 2026,
      month: 8,
      day: 20,
    });
    expect(port.parseLocalDate).toHaveBeenCalledWith('2026-08-20');
  });

  it.each([null, undefined, 20_260_820])(
    'rejects non-string input %s',
    (value) => {
      expect(
        createZodLocalDateSchema({} as CalendarPort).safeParse(value).success,
      ).toBe(false);
    },
  );

  it('maps a parser rejection to a Zod issue', () => {
    const port = {
      parseLocalDate: vi.fn(() => {
        throw new RangeError('Invalid local date');
      }),
    } as unknown as CalendarPort;
    const result = createZodLocalDateSchema(port).safeParse('invalid');
    expect(result.error?.issues[0]?.message).toBe('Invalid local date');
  });
});
