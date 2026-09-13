import { DateTime } from 'luxon';
import { createLuxonRuntime } from '@tankos/time-luxon';
import { parseLocalTime } from '@tankos/time';
import { TimeFieldCodec } from './time-field-codec';

const runtime = createLuxonRuntime();
const codec = new TimeFieldCodec(runtime.timePort);

describe('Material temporal adaptation', () => {
  it('round trips dates including years below 100 without UTC conversion', () => {
    for (const text of ['0001-01-01', '0099-12-31', '2024-02-29']) {
      const value = runtime.timePort.parseLocalDate(text);
      const material = codec.toMaterial(value, 'local-date', '');
      expect(codec.fromMaterial(material, null, 'local-date', '')).toEqual(
        value,
      );
      expect(codec.magnitude(value)).toBe(
        value.year * 10000 + value.month * 100 + value.day,
      );
    }
  });
  it('round trips a civil clock with milliseconds', () => {
    const value = parseLocalTime('23:59:59.123');
    expect(
      codec.fromMaterial(
        null,
        codec.toMaterial(value, 'local-time', ''),
        'local-time',
        '',
      ),
    ).toEqual(value);
    expect(codec.magnitude(value)).toBe(86_399_123);
  });
  it('round trips an instant in an explicit zone, not the browser zone', () => {
    const value = runtime.timePort.parseInstant('2026-06-01T12:30:45.123Z');
    const material = codec.toMaterial(value, 'instant', 'Atlantic/Canary');
    const clock = codec.toMaterial(
      value,
      'instant',
      'Atlantic/Canary',
      'clock',
    );
    expect(clock.hour).toBe(13);
    expect(
      codec.fromMaterial(material, clock, 'instant', 'Atlantic/Canary'),
    ).toEqual(value);
    expect(codec.magnitude(value)).toBe(value.epochMilliseconds);
  });
  it('handles empty values and rejects incomplete instants and mismatched kinds', () => {
    for (const kind of ['local-date', 'local-time', 'instant'] as const)
      expect(codec.fromMaterial(null, null, kind, '')).toBeNull();
    expect(() =>
      codec.fromMaterial(DateTime.utc(), null, 'instant', 'UTC'),
    ).toThrow(RangeError);
    expect(() =>
      codec.fromMaterial(null, DateTime.utc(), 'instant', 'UTC'),
    ).toThrow(RangeError);
    expect(() =>
      codec.toMaterial(parseLocalTime('12:00'), 'instant', ''),
    ).toThrow(RangeError);
  });
  it.each([
    ['2026-03-29', 1, 30],
    ['2026-10-25', 1, 30],
  ])('uses Luxon resolution for DST gap or overlap %s', (day, hour, minute) => {
    const date = codec.toMaterial(
      runtime.timePort.parseLocalDate(String(day)),
      'local-date',
      '',
    );
    const clock = DateTime.utc(2000, 1, 1, Number(hour), Number(minute));
    const expected = DateTime.fromObject(
      {
        year: date.year,
        month: date.month,
        day: date.day,
        hour: clock.hour,
        minute: clock.minute,
      },
      { zone: 'Atlantic/Canary' },
    );
    expect(
      codec.fromMaterial(date, clock, 'instant', 'Atlantic/Canary'),
    ).toEqual({ kind: 'instant', epochMilliseconds: expected.toMillis() });
  });
  it('rejects missing zones and invalid native widget values', () => {
    const value = runtime.timePort.parseInstant(0);
    expect(() => codec.toMaterial(value, 'instant', '')).toThrow(RangeError);
    expect(() =>
      codec.fromMaterial(DateTime.invalid('test'), null, 'local-date', ''),
    ).toThrow(RangeError);
    expect(() =>
      codec.fromMaterial(null, DateTime.invalid('test'), 'local-time', ''),
    ).toThrow(RangeError);
  });
});
