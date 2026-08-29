import { createServiceFactory } from '@ngneat/spectator/vitest';
import { LOCALE_ID } from '@angular/core';
import { TimeDisplayService } from '../application';
import { provideTimeAngularTestRuntime } from '../../../test-setup';
import { provideAngularTimeDisplayAdapter } from './provide-angular-time-display-adapter';

it('integrates the closed Angular locale contract with the display adapter', () => {
  const createService = createServiceFactory(TimeDisplayService);
  const spectator = createService({
    providers: [
      ...provideTimeAngularTestRuntime(),
      provideAngularTimeDisplayAdapter('UTC'),
      { provide: LOCALE_ID, useValue: 'en-US' },
    ],
  });
  expect(spectator.service.formatInstant(0, { format: 'longDate' })).toBe(
    'January 1, 1970',
  );
});
