import type { DecimalArithmeticPort, DecimalValue } from '../core';
import { createDecimalRuntime } from './create-decimal-runtime';

describe('createDecimalRuntime', () => {
  const arithmetic: DecimalArithmeticPort = {
    add: () => '3' as DecimalValue,
    subtract: () => '1' as DecimalValue,
    multiply: () => '2' as DecimalValue,
    divide: () => '0.5' as DecimalValue,
    remainder: () => '1' as DecimalValue,
    power: () => '1' as DecimalValue,
    round: () => '1' as DecimalValue,
    negate: () => '-1' as DecimalValue,
    compare: () => 0,
  };

  it('creates immutable fluent values with the selected arithmetic implementation', () => {
    const runtime = createDecimalRuntime(arithmetic);

    expect(runtime.decimal('1').add('2').value).toBe('3');
    expect(runtime.decimal('1').subtract('2').value).toBe('1');
    expect(runtime.decimal('1').multiply('2').value).toBe('2');
    expect(
      runtime.decimal('1').divide('2', { decimalPlaces: 1, rounding: 'down' })
        .value,
    ).toBe('0.5');
    expect(runtime.decimal('1').remainder('2').value).toBe('1');
    expect(runtime.decimal('1').power('2').value).toBe('1');
    expect(
      runtime.decimal('1.1').round({ decimalPlaces: 0, rounding: 'down' })
        .value,
    ).toBe('1');
    expect(runtime.decimal('1').negate().value).toBe('-1');
    expect(runtime.decimal('1').compare(runtime.decimal('2'))).toBe(0);
  });

  it('serializes a Decimal while rejecting implicit numeric coercion', () => {
    const value = createDecimalRuntime(arithmetic).decimal('1');

    expect(value.toString()).toBe('1');
    expect(value.toJSON()).toBe('1');
    expect(value[Symbol.toPrimitive]('string')).toBe('1');
    expect(() => Number(value)).toThrow(TypeError);
  });
});
