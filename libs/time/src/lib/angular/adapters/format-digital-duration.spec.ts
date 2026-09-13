import { formatDigitalDuration } from './format-digital-duration';

it('keeps hours unbounded while padding all digital components', () => {
  expect(
    formatDigitalDuration({
      days: 2,
      hours: 1,
      minutes: 2,
      seconds: 3,
      milliseconds: 999,
    }),
  ).toBe('49:02:03');
});
