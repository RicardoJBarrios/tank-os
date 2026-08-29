import * as publicApi from './index';

describe('Decimal Angular entry point', () => {
  it('exposes DI and presentation APIs without exposing formatting internals', () => {
    expect(publicApi.DecimalService).toEqual(expect.any(Function));
    expect(publicApi.DecimalPipe).toEqual(expect.any(Function));
    expect(publicApi.provideDecimalAngular).toEqual(expect.any(Function));
    expect('formatAngularDecimal' in publicApi).toBe(false);
  });
});
