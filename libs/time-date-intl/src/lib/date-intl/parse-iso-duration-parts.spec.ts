import { parseIsoDurationParts } from './parse-iso-duration-parts';

it.each([
  ['P2D', { days: 2, hours: 0, minutes: 0, seconds: 0, fraction: undefined }],
  [
    '-PT1H2M3.45S',
    { days: 0, hours: 1, minutes: 2, seconds: 3, fraction: '45' },
  ],
  [
    'P1DT2H',
    { days: 1, hours: 2, minutes: 0, seconds: 0, fraction: undefined },
  ],
] as const)('parses ISO parts %s', (value, expected) => {
  expect(parseIsoDurationParts(value)).toEqual(expected);
});
it.each(['1D', 'P', 'PT', 'P1Y', 'P1M', 'PT.5S', 'P1DT'])(
  'rejects unsupported ISO parts %s',
  (value) => {
    expect(parseIsoDurationParts(value)).toBeUndefined();
  },
);
