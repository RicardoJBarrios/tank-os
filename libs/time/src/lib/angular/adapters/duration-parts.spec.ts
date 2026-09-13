import { durationParts } from './duration-parts';

describe('durationParts', () => {
  it.each([
    [0, { days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }],
    [
      90_061_007,
      { days: 1, hours: 1, minutes: 1, seconds: 1, milliseconds: 7 },
    ],
  ])('splits %s exactly', (value, expected) => {
    expect(durationParts(value)).toEqual(expected);
  });
});
