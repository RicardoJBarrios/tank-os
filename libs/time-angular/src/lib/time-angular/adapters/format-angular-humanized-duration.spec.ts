import { TimePort } from '@tankos/time';
import { formatAngularHumanizedDuration } from './format-angular-humanized-duration';

it('normalizes through the port and honors locale and approximation options', () => {
  const port = {
    parseDuration: vi
      .fn()
      .mockReturnValue({ kind: 'duration', milliseconds: 60 * 86_400_000 }),
  } as unknown as TimePort;
  expect(
    formatAngularHumanizedDuration(port, 'en-US', 'input', {
      calendarUnits: 'approximate',
    }),
  ).toBe('in 2 months');
  expect(port.parseDuration).toHaveBeenCalledWith('input');
});
