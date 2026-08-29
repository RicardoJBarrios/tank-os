import { inject, Pipe, PipeTransform } from '@angular/core';
import { TimeDisplayService } from '../application';
import { LocalDate } from '@tankos/time';
import { LocalDateDisplayOptions } from '../contracts';

/** Renders a calendar date without applying a time-zone conversion. */
@Pipe({ name: 'tankLocalDate', standalone: true })
export class LocalDatePipe implements PipeTransform {
  readonly #display = inject(TimeDisplayService);

  /** Formats a present value or returns an empty string for absent input. */
  public transform(
    value: LocalDate | string | null | undefined,
    format?: string,
    locale?: string,
    options?: LocalDateDisplayOptions,
  ): string {
    if (value === null || value === undefined) return '';
    const displayOptions: {
      format?: string;
      locale?: string;
    } = { ...options };
    if (format !== undefined) displayOptions.format = format;
    if (locale !== undefined) displayOptions.locale = locale;
    return this.#display.formatLocalDate(value, displayOptions);
  }
}
