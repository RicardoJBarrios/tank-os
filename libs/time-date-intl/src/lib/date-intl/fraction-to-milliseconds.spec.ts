import { fractionToMilliseconds } from './fraction-to-milliseconds';

it.each([
  [undefined, 0],
  ['1', 100],
  ['01', 10],
  ['001', 1],
  ['1239', 123],
] as const)('converts fraction %s', (value, expected) => {
  expect(fractionToMilliseconds(value)).toBe(expected);
});
