import { isValidDurationObject } from './is-valid-duration-object';

it.each([
  [{ kind: 'duration', milliseconds: 1 }, true],
  [{ kind: 'duration', milliseconds: Infinity }, false],
  [{ kind: 'instant', milliseconds: 1 }, false],
  [null, false],
  [1, false],
] as const)('validates duration object %s', (value, expected) => {
  expect(isValidDurationObject(value)).toBe(expected);
});
