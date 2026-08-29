import { parseInstantParts } from './parse-instant-parts';

it('extracts all instant components', () => {
  expect(
    parseInstantParts('2026-08-20T15:30:01.25+01:00').groups,
  ).toMatchObject({
    year: '2026',
    month: '08',
    day: '20',
    hour: '15',
    minute: '30',
    second: '01',
    fraction: '25',
    offset: '+01:00',
  });
});
it.each(['', '2026-08-20T15:30:01', '2026-08-20 15:30:01Z'])(
  'rejects malformed instant %s',
  (value) => {
    expect(() => parseInstantParts(value)).toThrow(RangeError);
  },
);
