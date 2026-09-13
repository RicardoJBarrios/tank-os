import {
  parseLocalTime,
  toLocalTimeString,
  type Instant,
  type LocalDate,
  type LocalTime,
  type TimePort,
} from '@tankos/time';
import { DateTime } from 'luxon';

/** Domain values accepted by the temporal form control. */
export type TimeFieldValue = LocalDate | LocalTime | Instant;
/** Editing semantics; an instant always needs an explicit IANA zone. */
export type TimeFieldKind = TimeFieldValue['kind'];

const MATERIAL_REFERENCE_YEAR = 2000;

/** Internal adaptation for Material/Luxon widgets; UTC holds civil fields only. */
export class TimeFieldCodec {
  public constructor(private readonly time: TimePort) {}

  /** Adapts a domain value to local fields for Material, never to a stored DateTime. */
  public toMaterial(
    value: TimeFieldValue,
    kind: TimeFieldKind,
    zone: string,
    part: 'date' | 'clock' = 'date',
  ): DateTime {
    if (value.kind !== kind)
      throw new RangeError('Temporal field kind mismatch');
    if (value.kind === 'local-date') {
      const date = this.time.parseLocalDate(value);
      return materialDate(date.year, date.month, date.day);
    }
    if (value.kind === 'local-time')
      return materialClock(parseLocalTime(value));
    const instant = this.time.parseInstant(value);
    const fields = DateTime.fromMillis(instant.epochMilliseconds, { zone });
    if (!fields.isValid) throw new RangeError('Invalid time zone');
    return part === 'clock'
      ? materialClock(readClock(fields))
      : materialDate(fields.year, fields.month, fields.day);
  }

  /** Resolves edited fields through the selected runtime's zone semantics. */
  public fromMaterial(
    date: DateTime | null,
    clock: DateTime | null,
    kind: TimeFieldKind,
    zone: string,
  ): TimeFieldValue | null {
    if (kind === 'local-date') return this.readOptionalDate(date);
    if (kind === 'local-time') return readOptionalClock(clock);
    if (!date && !clock) return null;
    if (!date || !clock)
      throw new RangeError('Both date and time are required');
    const fields = `${this.time.toLocalDateString(this.readDate(date))}T${toLocalTimeString(readClock(clock))}`;
    return this.time.fromZonedDateTime(fields, zone);
  }

  /** Stable sortable magnitude for inclusive bounds within the same kind. */
  public magnitude(value: TimeFieldValue): number {
    if (value.kind === 'instant')
      return this.time.parseInstant(value).epochMilliseconds;
    if (value.kind === 'local-date') {
      const date = this.time.parseLocalDate(value);
      return date.year * 10_000 + date.month * 100 + date.day;
    }
    const clock = parseLocalTime(value);
    return (
      ((clock.hour * 60 + clock.minute) * 60 + clock.second) * 1_000 +
      clock.millisecond
    );
  }

  private readDate(value: DateTime): LocalDate {
    return this.time.parseLocalDate({
      kind: 'local-date',
      year: value.year,
      month: value.month,
      day: value.day,
    });
  }

  private readOptionalDate(value: DateTime | null): LocalDate | null {
    return value ? this.readDate(value) : null;
  }
}

function materialDate(year: number, month: number, day: number): DateTime {
  return DateTime.utc(year, month, day, 12);
}

function materialClock(value: LocalTime): DateTime {
  return DateTime.utc(
    MATERIAL_REFERENCE_YEAR,
    1,
    1,
    value.hour,
    value.minute,
    value.second,
    value.millisecond,
  );
}

function readClock(value: DateTime): LocalTime {
  return parseLocalTime({
    kind: 'local-time',
    hour: value.hour,
    minute: value.minute,
    second: value.second,
    millisecond: value.millisecond,
  });
}

function readOptionalClock(value: DateTime | null): LocalTime | null {
  return value ? readClock(value) : null;
}
