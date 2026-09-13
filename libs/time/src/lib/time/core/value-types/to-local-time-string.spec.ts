import { toLocalTimeString } from './to-local-time-string';
import { parseLocalTime } from './parse-local-time';

it('serializes all precision and accepts both input forms', () => {
  expect(toLocalTimeString('09:08')).toBe('09:08:00.000');
  expect(toLocalTimeString(parseLocalTime('23:59:59.123'))).toBe(
    '23:59:59.123',
  );
  expect(() => toLocalTimeString('24:00')).toThrow(RangeError);
});
