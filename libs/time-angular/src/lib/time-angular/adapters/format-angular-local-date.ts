import { DatePipe } from '@angular/common';
import { LocalDateInput, TimePort } from '@tankos/time';
import { LocalDateDisplayOptions } from '../contracts';

/** Formats a zone-free calendar date without allowing a zone to shift its day. */
export function formatAngularLocalDate(
  datePipe: DatePipe,
  timePort: TimePort,
  value: LocalDateInput,
  options?: LocalDateDisplayOptions,
): string {
  const localDate = timePort.parseLocalDate(value);
  const instant = timePort.fromZonedDateTime(
    `${timePort.toLocalDateString(localDate)}T00:00:00.000`,
    'UTC',
  );
  return (
    datePipe.transform(
      instant.epochMilliseconds,
      options?.format ?? 'mediumDate',
      '+0000',
      options?.locale,
    ) ?? ''
  );
}
