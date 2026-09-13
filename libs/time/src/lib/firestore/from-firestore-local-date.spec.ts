import { CalendarPort } from '@tankos/time';
import { fromFirestoreLocalDate } from './from-firestore-local-date';

describe('fromFirestoreLocalDate', () => {
  const port = {
    parseLocalDate: vi
      .fn()
      .mockReturnValue({ kind: 'local-date', year: 2026, month: 8, day: 20 }),
  } as unknown as CalendarPort;

  it('delegates string parsing to the port', () => {
    expect(fromFirestoreLocalDate(port, '2026-08-20')).toEqual({
      kind: 'local-date',
      year: 2026,
      month: 8,
      day: 20,
    });
  });

  it.each([null, 20260820, {}, undefined])(
    'rejects a non-string value: %s',
    (value) => {
      expect(() => fromFirestoreLocalDate(port, value)).toThrow(RangeError);
    },
  );
});
