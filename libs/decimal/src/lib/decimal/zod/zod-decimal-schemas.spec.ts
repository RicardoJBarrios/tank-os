import { createZodDecimalSchemas } from './zod-decimal-schemas';

describe('createZodDecimalSchemas', () => {
  it('composes canonical decimal and rounding-context schemas', () => {
    const schemas = createZodDecimalSchemas();

    expect(schemas.value.parse('001.20')).toBe('1.2');
    expect(
      schemas.context.parse({ decimalPlaces: 2, rounding: 'half-up' }),
    ).toEqual({
      decimalPlaces: 2,
      rounding: 'half-up',
    });
  });

  it('maps invalid external values to Zod issues', () => {
    const schemas = createZodDecimalSchemas();

    expect(schemas.value.safeParse('1,2').success).toBe(false);
    expect(
      schemas.context.safeParse({ decimalPlaces: -1, rounding: 'down' })
        .success,
    ).toBe(false);
  });
});
