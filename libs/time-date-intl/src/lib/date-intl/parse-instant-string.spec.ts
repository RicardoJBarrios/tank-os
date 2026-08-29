import { parseInstantString } from './parse-instant-string';

it.each([
  ['1970-01-01T00:00:00Z', 0],
  ['1970-01-01T01:00:00+01:00', 0],
  ['1970-01-01T00:00:00.1239Z', 123],
  ['1969-12-31T23:59:59.999Z', -1],
] as const)('parses instant string %s', (value, expected) => {
  expect(parseInstantString(value)).toBe(expected);
});
