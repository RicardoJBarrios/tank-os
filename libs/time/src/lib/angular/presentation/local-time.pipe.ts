import { formatDate } from '@angular/common';
import { inject, LOCALE_ID, Pipe, type PipeTransform } from '@angular/core';
import { toLocalTimeString, type LocalTimeInput } from '@tankos/time';
import { assertCivilFormat } from '../adapters/assert-civil-format';

/** Displays a civil clock time without applying any user or browser zone. */
@Pipe({ name: 'tankLocalTime', standalone: true })
export class LocalTimePipe implements PipeTransform {
  readonly #locale = inject(LOCALE_ID);

  /** Formats clock fields against a fixed UTC reference date, never an instant. */
  public transform(
    value: LocalTimeInput | null | undefined,
    format = 'mediumTime',
    locale = this.#locale,
  ): string {
    if (value === null || value === undefined) return '';
    assertCivilFormat(format, 'time');
    return formatDate(
      `2000-01-01T${toLocalTimeString(value)}Z`,
      format,
      locale,
      'UTC',
    );
  }
}
