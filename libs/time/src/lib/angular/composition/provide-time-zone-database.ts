import { Provider } from '@angular/core';
import { TimeZoneDatabasePort } from '@tankos/time';
import { TIME_ZONE_DATABASE } from '../application';

/** Registers the replaceable IANA time-zone rules source. */
export function provideTimeZoneDatabase(
  database: TimeZoneDatabasePort,
): Provider {
  return { provide: TIME_ZONE_DATABASE, useValue: database };
}
