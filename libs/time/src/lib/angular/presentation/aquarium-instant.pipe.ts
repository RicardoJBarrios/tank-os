import { inject, Pipe, PipeTransform } from '@angular/core';
import { InstantInput } from '@tankos/time';
import { TimeDisplayService } from '../application';
import { TimeDisplayOptions } from '../contracts';

/** Renders an instant in the aquarium zone, then user zone, then UTC. */
@Pipe({ name: 'tankAquariumInstant', standalone: true })
export class AquariumInstantPipe implements PipeTransform {
  readonly #display = inject(TimeDisplayService);

  public transform(
    value: InstantInput | null | undefined,
    format?: string,
    locale?: string,
    options?: Omit<TimeDisplayOptions, 'timeZone'>,
  ): string {
    if (value === null || value === undefined) return '';
    const displayOptions: Omit<TimeDisplayOptions, 'timeZone'> = {
      ...options,
      ...(format === undefined ? {} : { format }),
      ...(locale === undefined ? {} : { locale }),
    };
    return this.#display.formatInstantForAquarium(value, displayOptions);
  }
}
