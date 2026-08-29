import { hasNumericDateFields } from './has-numeric-date-fields';

it.each([
  [{ year: 2026, month: 8, day: 20 }, true],
  [{ year: '2026', month: 8, day: 20 }, false],
  [{ year: 2026, month: null, day: 20 }, false],
  [{ year: 2026, month: 8 }, false],
] as const)('narrows numeric date fields %s', (value, expected) => {
  expect(hasNumericDateFields(value)).toBe(expected);
});
