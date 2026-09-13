import { isValidStructuredInstant } from './is-valid-structured-instant';

it.each([
  [{ kind: 'instant', epochMilliseconds: 0 }, true],
  [{ kind: 'instant', epochMilliseconds: '0' }, false],
  [{ kind: 'duration', epochMilliseconds: 0 }, false],
  [null, false],
] as const)('validates structured instant %s', (value, expected) => {
  expect(isValidStructuredInstant(value)).toBe(expected);
});
