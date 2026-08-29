import { parseObjectDuration } from './parse-object-duration';

it('normalizes and clones a structured duration', () => {
  const input = { kind: 'duration' as const, milliseconds: -1.9 };
  expect(parseObjectDuration(input)).toEqual({
    kind: 'duration',
    milliseconds: -1,
  });
  expect(parseObjectDuration(input)).not.toBe(input);
});
it.each([
  {},
  { kind: 'instant', milliseconds: 1 },
  { kind: 'duration', milliseconds: Infinity },
])('rejects invalid duration object %s', (value) => {
  expect(() => parseObjectDuration(value as never)).toThrow(RangeError);
});
