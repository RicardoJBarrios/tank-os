import { dateIntlNow } from './date-intl-now';

it('reads the current JavaScript system clock', () => {
  vi.spyOn(Date, 'now').mockReturnValue(123);
  expect(dateIntlNow()).toEqual({ kind: 'instant', epochMilliseconds: 123 });
});
