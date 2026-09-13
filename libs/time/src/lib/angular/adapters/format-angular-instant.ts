import { DatePipe } from '@angular/common';
import { InstantInput, TimePort, TimeZoneDatabasePort } from '@tankos/time';
import { TimeDisplayOptions } from '../contracts';
import { toDatePipeTimeZone } from './angular-time-zone-offset';

/** Formats an instant through Angular after resolving its display-zone offset. */
export function formatAngularInstant(
  datePipe: DatePipe,
  timePort: TimePort,
  timeZoneDatabase: TimeZoneDatabasePort,
  defaultTimeZone: string,
  value: InstantInput,
  options?: TimeDisplayOptions,
): string {
  const instant = timePort.parseInstant(value);
  const timeZone = options?.timeZone ?? defaultTimeZone;
  return (
    datePipe.transform(
      instant.epochMilliseconds,
      options?.format,
      toDatePipeTimeZone(timeZone, instant.epochMilliseconds, timeZoneDatabase),
      options?.locale,
    ) ?? ''
  );
}
