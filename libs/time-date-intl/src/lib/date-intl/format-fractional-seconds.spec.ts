import { formatFractionalSeconds } from './format-fractional-seconds';

it.each([
  [0, ''],
  [1, '.001'],
  [10, '.01'],
  [100, '.1'],
  [123, '.123'],
] as const)('formats %s milliseconds', (value, expected) => {
  expect(formatFractionalSeconds(value)).toBe(expected);
});
