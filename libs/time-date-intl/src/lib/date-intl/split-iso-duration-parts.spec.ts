import { splitIsoDurationParts } from './split-iso-duration-parts';

it.each([
  ['P1D', { date: '1D', time: undefined }],
  ['PT2H', { date: undefined, time: 'T2H' }],
  ['-P1DT2H', { date: '1D', time: 'T2H' }],
  ['+PT1S', { date: undefined, time: 'T1S' }],
  ['1D', undefined],
] as const)('splits ISO duration %s', (value, expected) => {
  expect(splitIsoDurationParts(value)).toEqual(expected);
});
