import {
  FORMATTER_CACHE_LIMIT,
  getTimeZoneFormatter,
} from './get-time-zone-formatter';

describe('get-time-zone-formatter', () => {
  it('Given a time zone, When requesting its formatter twice, Then the cached formatter is reused', () => {
    expect(getTimeZoneFormatter('UTC')).toBe(getTimeZoneFormatter('UTC'));
  });

  it('Given more zones than the cache limit, When requesting another formatter, Then the oldest formatter is evicted', () => {
    const zones = Intl.supportedValuesOf('timeZone').slice(
      0,
      FORMATTER_CACHE_LIMIT + 1,
    );
    const firstFormatter = getTimeZoneFormatter(zones[0]);
    for (const zone of zones.slice(1)) getTimeZoneFormatter(zone);
    expect(getTimeZoneFormatter(zones[0])).not.toBe(firstFormatter);
  });
});
