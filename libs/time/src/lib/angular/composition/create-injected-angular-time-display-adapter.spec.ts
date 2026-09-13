import { createServiceFactory } from '@ngneat/spectator/vitest';
import { TimeDisplayService, TIME_DISPLAY_ADAPTER } from '../application';
import { provideTimeAngularTestRuntime } from '../../../test-setup';
import { createInjectedAngularTimeDisplayAdapter } from './create-injected-angular-time-display-adapter';

it('creates the DatePipe-backed adapter inside Angular injection', () => {
  const createService = createServiceFactory(TimeDisplayService);
  const spectator = createService({
    providers: [
      ...provideTimeAngularTestRuntime(),
      {
        provide: TIME_DISPLAY_ADAPTER,
        useFactory: createInjectedAngularTimeDisplayAdapter,
      },
    ],
  });

  expect(
    spectator.service.formatInstant(0, {
      format: 'yyyy-MM-dd',
      timeZone: 'UTC',
    }),
  ).toBe('1970-01-01');
});
