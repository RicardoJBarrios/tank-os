import type { TimeZoneDatabasePort } from '@tankos/time';
import { TIME_ZONE_DATABASE } from '../application';
import { provideTimeZoneDatabase } from './provide-time-zone-database';

it('provides the selected time-zone database by identity', () => {
  const database = {} as TimeZoneDatabasePort;
  expect(provideTimeZoneDatabase(database)).toEqual({
    provide: TIME_ZONE_DATABASE,
    useValue: database,
  });
});
