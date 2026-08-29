import { TIME_DISPLAY_ADAPTER } from '../application';
import { TimeDisplayAdapter } from '../contracts';
import { provideTimeDisplayAdapter } from './provide-time-display-adapter';

it('provides a custom display adapter by identity', () => {
  const adapter = {} as TimeDisplayAdapter;
  expect(provideTimeDisplayAdapter(adapter)).toEqual({
    provide: TIME_DISPLAY_ADAPTER,
    useValue: adapter,
  });
});
