import { compareInstants } from './compare-instants';

describe('compare-instants', () => {
  it.each([
    [0, 1, -1],
    [0, '1970-01-01T00:00:01Z', -1],
    [0, { kind: 'instant', epochMilliseconds: 1 }, -1],
    ['1970-01-01T00:00:01Z', 0, 1],
    [1, 1, 0],
    ['1970-01-01T00:00:01Z', { kind: 'instant', epochMilliseconds: 1_000 }, 0],
    [1, 0, 1],
    [{ kind: 'instant', epochMilliseconds: 1 }, 0, 1],
  ] as const)(
    'Given instants %s and %s, When comparing them, Then it returns %s',
    (left, right, expected) => {
      expect(compareInstants(left, right)).toBe(expected);
    },
  );
});
