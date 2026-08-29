import { DatePipe } from '@angular/common';
import type { TimePort, TimeZoneDatabasePort } from '@tankos/time';
import { createAngularTimeDisplayAdapter } from './angular-time-display-adapter';

it('composes the independently tested display operations', () => {
  const datePipe = new DatePipe('en-US');
  vi.spyOn(datePipe, 'transform').mockReturnValue('formatted');
  const timePort = {
    parseInstant: () => ({ kind: 'instant', epochMilliseconds: 0 }),
    parseLocalDate: () => ({
      kind: 'local-date',
      year: 2026,
      month: 8,
      day: 20,
    }),
    toLocalDateString: () => '2026-08-20',
    fromZonedDateTime: () => ({ kind: 'instant', epochMilliseconds: 0 }),
    parseDuration: () => ({ kind: 'duration', milliseconds: 0 }),
    toDurationIsoString: () => 'PT0S',
  } as unknown as TimePort;
  const timeZoneDatabase = {
    getOffsetMinutes: () => 0,
  } as TimeZoneDatabasePort;
  const adapter = createAngularTimeDisplayAdapter(
    datePipe,
    timePort,
    'UTC',
    timeZoneDatabase,
    'en-US',
  );

  expect(adapter.formatInstant(0)).toBe('formatted');
  expect(adapter.formatLocalDate('2026-08-20')).toBe('formatted');
  expect(adapter.formatDuration(0)).toBe('0 ms');
  expect(adapter.formatHumanizedDuration(0)).toBe('now');
});
