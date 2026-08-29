import { isValidDurationCandidate } from './is-valid-duration-candidate';

it.each([
  [{ kind: 'duration', milliseconds: 1 }, true],
  [{ kind: 'duration', milliseconds: NaN }, false],
  [{ kind: 'instant', milliseconds: 1 }, false],
  [{ kind: 'duration' }, false],
] as const)('validates candidate %s', (value, expected) => {
  expect(isValidDurationCandidate(value as never)).toBe(expected);
});
