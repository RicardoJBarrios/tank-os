import { isValidDuration } from './is-valid-duration';

describe('is-valid-duration', () => {
  it.each([
    0,
    -1,
    1.9,
    'PT1S',
    'PT1.000999S',
    'P1D',
    'P1M',
    'P1Y',
    'PT',
    'P1DT',
    { kind: 'duration', milliseconds: 1 },
  ])(
    'Given a valid duration input %s, When validating it, Then it returns true',
    (value) => {
      expect(isValidDuration(value)).toBe(true);
    },
  );

  it.each([
    null,
    undefined,
    NaN,
    Infinity,
    -Infinity,
    '',
    ' PT1S',
    'PT1S ',
    'PT1S✨',
    { kind: 'other', milliseconds: 1 },
    { kind: 'duration' },
    { kind: 'duration', milliseconds: '1' },
    { kind: 'duration', milliseconds: Infinity },
  ])(
    'Given an invalid duration input %s, When validating it, Then it returns false',
    (value) => {
      expect(isValidDuration(value)).toBe(false);
    },
  );
});
