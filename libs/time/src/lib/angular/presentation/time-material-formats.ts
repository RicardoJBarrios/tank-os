import { MAT_LUXON_DATE_FORMATS } from '@angular/material-luxon-adapter';
import type { MatDateFormats } from '@angular/material/core';

/** Each field owns its mutable Material format configuration. Tokens are Luxon tokens. */
export function createTimeMaterialFormats(): MatDateFormats {
  return {
    parse: {
      dateInput: 'D',
      timeInput: ['t', 'HH:mm:ss.SSS', 'HH:mm:ss', 'HH:mm', 'h:mm a'],
    },
    display: { ...MAT_LUXON_DATE_FORMATS.display },
  };
}
