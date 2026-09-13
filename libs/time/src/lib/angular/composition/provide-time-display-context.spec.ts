import { TIME_DISPLAY_CONTEXT } from '../application';
import { provideTimeDisplayContext } from './provide-time-display-context';

it('provides the display context by identity', () => {
  const context = { userTimeZone: 'Atlantic/Canary' };
  expect(provideTimeDisplayContext(context)).toEqual({
    provide: TIME_DISPLAY_CONTEXT,
    useValue: context,
  });
});
