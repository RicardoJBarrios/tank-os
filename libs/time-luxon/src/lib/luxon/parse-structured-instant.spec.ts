import { parseStructuredInstant } from './parse-structured-instant';

it('truncates structured instant milliseconds', () => {
  expect(
    parseStructuredInstant({ kind: 'instant', epochMilliseconds: -1.9 }),
  ).toBe(-1);
});
it.each([
  null,
  {},
  { kind: 'duration', epochMilliseconds: 0 },
  { kind: 'instant', epochMilliseconds: '0' },
])('rejects invalid structured instant %s', (value) => {
  expect(() => parseStructuredInstant(value)).toThrow(RangeError);
});
