import { Provider } from '@angular/core';
import { TIME_DISPLAY_CONTEXT } from '../application';
import { TimeDisplayContext } from '../contracts';

/** Registers aquarium and user zones used by the display fallback policy. */
export function provideTimeDisplayContext(
  context: TimeDisplayContext,
): Provider {
  return { provide: TIME_DISPLAY_CONTEXT, useValue: context };
}
