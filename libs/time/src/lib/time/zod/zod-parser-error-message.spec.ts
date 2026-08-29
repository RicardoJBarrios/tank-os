import { zodParserErrorMessage } from './zod-parser-error-message';

it.each([
  [new RangeError('specific'), 'specific'],
  [new Error(''), 'Invalid value'],
  ['', 'Invalid value'],
  [null, 'Invalid value'],
  ['external', 'external'],
] as const)('normalizes parser failure %s', (error, expected) => {
  expect(zodParserErrorMessage(error, 'value')).toBe(expected);
});
