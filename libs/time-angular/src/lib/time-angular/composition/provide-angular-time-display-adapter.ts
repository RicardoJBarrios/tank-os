import { Provider } from '@angular/core';
import { TIME_DISPLAY_ADAPTER } from '../application';
import { createInjectedAngularTimeDisplayAdapter } from './create-injected-angular-time-display-adapter';

/**
 * Registers Angular's `DatePipe` as the active localized display adapter.
 *
 * @param defaultTimeZone - Fallback zone used when a view supplies no zone.
 */
export function provideAngularTimeDisplayAdapter(
  defaultTimeZone?: string,
): Provider {
  return {
    provide: TIME_DISPLAY_ADAPTER,
    useFactory: createInjectedAngularTimeDisplayAdapter.bind(
      undefined,
      defaultTimeZone,
    ),
  };
}
