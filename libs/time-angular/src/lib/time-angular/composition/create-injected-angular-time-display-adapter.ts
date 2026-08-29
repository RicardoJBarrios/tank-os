import { DATE_PIPE_DEFAULT_OPTIONS, DatePipe } from '@angular/common';
import { inject, LOCALE_ID } from '@angular/core';
import { createAngularTimeDisplayAdapter } from '../adapters';
import { TIME_PORT, TIME_ZONE_DATABASE } from '../application';
import type { TimeDisplayAdapter } from '../contracts';

/** Creates the default display adapter inside an Angular injection context. */
export function createInjectedAngularTimeDisplayAdapter(
  defaultTimeZone = 'UTC',
): TimeDisplayAdapter {
  const locale = inject(LOCALE_ID);
  return createAngularTimeDisplayAdapter(
    new DatePipe(
      locale,
      undefined,
      inject(DATE_PIPE_DEFAULT_OPTIONS, { optional: true }),
    ),
    inject(TIME_PORT),
    defaultTimeZone,
    inject(TIME_ZONE_DATABASE),
    locale,
  );
}
