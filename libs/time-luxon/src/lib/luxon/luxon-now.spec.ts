import { luxonNow } from './luxon-now';

it('reads the current JavaScript system clock', () => {
  vi.spyOn(Date, 'now').mockReturnValue(123);
  expect(luxonNow()).toEqual({ kind: 'instant', epochMilliseconds: 123 });
});
