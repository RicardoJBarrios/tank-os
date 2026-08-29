import * as publicApi from './index';

describe('Date/Intl time entry point', () => {
  it('exposes only the supported runtime factories', () => {
    expect(publicApi.createDateIntlRuntime).toEqual(expect.any(Function));
    expect(publicApi.createDateIntlClock).toEqual(expect.any(Function));
    expect(publicApi.createDateIntlTimeAdapter).toEqual(expect.any(Function));
    expect(publicApi.createDateIntlTimeZoneDatabase).toEqual(
      expect.any(Function),
    );
  });

  it('keeps individual implementation operations internal', () => {
    expect(publicApi).not.toHaveProperty('parseInstant');
    expect(publicApi).not.toHaveProperty('daysInMonth');
    expect(publicApi).not.toHaveProperty('isValidTimeZone');
  });
});
