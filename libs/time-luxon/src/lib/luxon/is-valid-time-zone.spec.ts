import { isValidTimeZone } from './is-valid-time-zone';
import { IANAZone } from 'luxon';

describe('is-valid-time-zone', () => {
  it.each(['+01:00', '-0430'])(
    'delegates platform zone support to Luxon for %s',
    (value) => {
      expect(isValidTimeZone(value)).toBe(IANAZone.isValidZone(value));
    },
  );
  it('Given a recognized IANA identifier, When validating it, Then it returns true', () => {
    expect(isValidTimeZone('Atlantic/Canary')).toBe(true);
  });

  it.each([
    'Not/A_Time_Zone',
    '',
    '   ',
    ' UTC',
    'UTC ',
    'Europe/Pa✨ris',
    'Europe/Paris\n',
    null,
    undefined,
  ])(
    'Given invalid zone %s, When validating it, Then it returns false',
    (timeZone) => {
      expect(isValidTimeZone(timeZone as never)).toBe(false);
    },
  );
});
