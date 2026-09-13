/** A civil clock time without date, offset or time zone. */
export interface LocalTime {
  readonly kind: 'local-time';
  /** Hour from 0 through 23. */
  readonly hour: number;
  /** Minute from 0 through 59. */
  readonly minute: number;
  /** Second from 0 through 59; leap seconds are not supported. */
  readonly second: number;
  /** Millisecond from 0 through 999. */
  readonly millisecond: number;
}

/** Supported civil clock input: a value or HH:mm[:ss[.SSS]]. */
export type LocalTimeInput = LocalTime | string;
