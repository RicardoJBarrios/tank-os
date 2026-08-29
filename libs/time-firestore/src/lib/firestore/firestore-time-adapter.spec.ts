import { Timestamp } from 'firebase/firestore';
import type { CalendarPort, DurationPort, InstantPort } from '@tankos/time';
import { createFirestoreTimeAdapter } from './firestore-time-adapter';

describe('createFirestoreTimeAdapter', () => {
  it('composes the independently tested Firestore conversions', () => {
    const port = {
      parseInstant: (value: number) => ({
        kind: 'instant',
        epochMilliseconds: value,
      }),
      parseLocalDate: () => ({
        kind: 'local-date',
        year: 2026,
        month: 8,
        day: 20,
      }),
      toLocalDateString: () => '2026-08-20',
      parseDuration: (value: number) => ({
        kind: 'duration',
        milliseconds: value,
      }),
    } as unknown as CalendarPort & DurationPort & InstantPort;
    const adapter = createFirestoreTimeAdapter(port);

    expect(adapter.fromTimestamp(adapter.toTimestamp(1_234))).toEqual({
      kind: 'instant',
      epochMilliseconds: 1_234,
    });
    expect(adapter.toTimestamp(1_234)).toEqual(Timestamp.fromMillis(1_234));
    expect(adapter.fromLocalDate(adapter.toLocalDate('2026-08-20'))).toEqual({
      kind: 'local-date',
      year: 2026,
      month: 8,
      day: 20,
    });
    expect(adapter.fromDuration(adapter.toDuration(3_600_000))).toEqual({
      kind: 'duration',
      milliseconds: 3_600_000,
    });
  });
});
