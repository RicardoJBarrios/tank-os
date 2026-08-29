import type { ClockPort, TimePort, TimeZoneDatabasePort } from '../ports';

/** Replaceable temporal runtime selected by an application composition root. */
export interface TimeRuntime {
  /** Clock used to obtain the current instant. */
  readonly clock: ClockPort;
  /** Complete implementation of the neutral temporal operations. */
  readonly timePort: TimePort;
  /** IANA rule source shared by calculations and presentation. */
  readonly timeZoneDatabase: TimeZoneDatabasePort;
}
