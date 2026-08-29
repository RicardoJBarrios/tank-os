import { evictOldestFormatter } from './evict-oldest-formatter';

it('evicts only the oldest formatter above the limit', () => {
  const formatter = new Intl.DateTimeFormat('en-US');
  const cache = new Map([
    ['first', formatter],
    ['second', formatter],
  ]);
  evictOldestFormatter(cache, 1);
  expect([...cache.keys()]).toEqual(['second']);
  evictOldestFormatter(cache, 1);
  expect([...cache.keys()]).toEqual(['second']);
});
