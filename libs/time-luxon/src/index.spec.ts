import * as publicApi from './index';

describe('Luxon time entry point', () => {
  it('exposes only the supported runtime factories', () => {
    expect(publicApi.createLuxonRuntime).toEqual(expect.any(Function));
    expect(publicApi.createLuxonClock).toEqual(expect.any(Function));
    expect(publicApi.createLuxonTimeAdapter).toEqual(expect.any(Function));
    expect(publicApi.createLuxonTimeZoneDatabase).toEqual(expect.any(Function));
  });

  it('keeps individual implementation operations internal', () => {
    expect(publicApi).not.toHaveProperty('parseInstant');
    expect(publicApi).not.toHaveProperty('daysInMonth');
    expect(publicApi).not.toHaveProperty('isValidTimeZone');
  });
});
