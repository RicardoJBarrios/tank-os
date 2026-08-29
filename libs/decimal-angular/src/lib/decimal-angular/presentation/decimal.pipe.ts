import { LOCALE_ID, Pipe, type PipeTransform, inject } from '@angular/core';
import type { DecimalValue } from '@tankos/decimal';
import { formatAngularDecimal } from './format-angular-decimal';

/** Renders a canonical Decimal using Angular's configured locale without loss. */
@Pipe({ name: 'tankDecimal' })
export class DecimalPipe implements PipeTransform {
  readonly #locale = inject(LOCALE_ID);

  public transform(value: DecimalValue | string | null | undefined): string | null {
    return value === null || value === undefined
      ? null
      : formatAngularDecimal(value, this.#locale);
  }
}
