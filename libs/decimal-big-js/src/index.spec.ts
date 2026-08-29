import * as publicApi from './index';

describe('Decimal Big.js entry point', () => {
  it('Given the Big.js entry point, When imported, Then exposes the adapter and neutral runtime composition', () => {
    expect(publicApi.createBigJsDecimalAdapter).toEqual(expect.any(Function));
    expect(publicApi.createBigJsDecimalRuntime).toEqual(expect.any(Function));
    expect(publicApi.createBigJsDecimalAdapter().add('1', '2')).toBe('3');
    expect(publicApi.createBigJsDecimalRuntime().decimal('1').add('2').value).toBe('3');
    expect('provideDecimalAngular' in publicApi).toBe(false);
  });
});
