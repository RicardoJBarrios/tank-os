import * as publicApi from './angular';

describe('Angular time entry point', () => {
  it('exposes the supported providers, services, contracts and pipes', () => {
    expect(publicApi.provideTimeAngular).toEqual(expect.any(Function));
    expect(publicApi.TimeService).toEqual(expect.any(Function));
    expect(publicApi.InstantPipe).toEqual(expect.any(Function));
    expect(publicApi.LocalTimePipe).toEqual(expect.any(Function));
    expect(publicApi.TimeField).toEqual(expect.any(Function));
  });

  it('does not expose internal display operations', () => {
    expect(publicApi).not.toHaveProperty('createAngularTimeDisplayAdapter');
    expect(publicApi).not.toHaveProperty('toDatePipeTimeZone');
    expect(publicApi).not.toHaveProperty('formatAngularInstant');
    expect(publicApi).not.toHaveProperty('TimeFieldCodec');
  });
});
