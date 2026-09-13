import { InvalidDecimalError } from '../errors';
import { decimalFromSafeInteger } from './decimal-from-safe-integer';

describe('decimalFromSafeInteger', () => {
  it.each([
    [0, '0'],
    [-12, '-12'],
    [Number.MAX_SAFE_INTEGER, '9007199254740991'],
  ])('converts exactly representable integer %s into %s', (value, expected) => {
    expect(decimalFromSafeInteger(value)).toBe(expected);
  });

  it.each([
    0.1,
    Number.MAX_SAFE_INTEGER + 1,
    Number.NaN,
    Number.POSITIVE_INFINITY,
  ])('rejects non-safe integer %s', (value) => {
    expect(() => decimalFromSafeInteger(value)).toThrow(InvalidDecimalError);
  });
});
