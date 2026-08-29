import { readMatchGroup } from './read-match-group';

const match = /(?<value>x)/u.exec('x') ?? undefined;
it('reads named groups and tolerates absent matches or names', () => {
  expect(readMatchGroup(match, 'value')).toBe('x');
  expect(readMatchGroup(match, 'missing')).toBeUndefined();
  expect(readMatchGroup(undefined, 'value')).toBeUndefined();
});
