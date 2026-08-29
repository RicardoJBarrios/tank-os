import { DatePipe } from '@angular/common';
import { TimePort, TimeZoneDatabasePort } from '@tankos/time';
import { TimeDisplayAdapter } from '../contracts';
import { formatAngularDuration } from './format-angular-duration';
import { formatAngularHumanizedDuration } from './format-angular-humanized-duration';
import { formatAngularInstant } from './format-angular-instant';
import { formatAngularLocalDate } from './format-angular-local-date';

/** Composes the independently testable Angular display operations. */
export function createAngularTimeDisplayAdapter(
  datePipe: DatePipe,
  timePort: TimePort,
  defaultTimeZone = 'UTC',
  timeZoneDatabase: TimeZoneDatabasePort,
  locale = 'en-US',
): TimeDisplayAdapter {
  return {
    formatInstant: formatAngularInstant.bind(
      undefined,
      datePipe,
      timePort,
      timeZoneDatabase,
      defaultTimeZone,
    ),
    formatLocalDate: formatAngularLocalDate.bind(undefined, datePipe, timePort),
    formatDuration: formatAngularDuration.bind(undefined, timePort, locale),
    formatHumanizedDuration: formatAngularHumanizedDuration.bind(
      undefined,
      timePort,
      locale,
    ),
  };
}
