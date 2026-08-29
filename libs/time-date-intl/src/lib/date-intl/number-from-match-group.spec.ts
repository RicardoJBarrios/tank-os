import { numberFromMatchGroup } from './number-from-match-group';

const match = /(?<value>42)/u.exec('42') ?? undefined;
it('reads numeric groups and defaults absent values to zero', () => {
  expect(numberFromMatchGroup(match, 'value')).toBe(42);
  expect(numberFromMatchGroup(match, 'missing')).toBe(0);
  expect(numberFromMatchGroup(undefined, 'value')).toBe(0);
});
