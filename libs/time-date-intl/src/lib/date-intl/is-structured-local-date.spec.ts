import { isStructuredLocalDate } from './is-structured-local-date';

it.each([
  [{ kind: 'local-date' }, true],
  [{ kind: 'instant' }, false],
  [null, false],
  ['local-date', false],
] as const)('detects structured local date %s', (value, expected) => {
  expect(isStructuredLocalDate(value)).toBe(expected);
});
