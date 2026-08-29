import { isValidTimeZone } from './is-valid-time-zone';

describe('is-valid-time-zone', () => {
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
    '+01:00',
    '-0430',
    null,
    undefined,
  ])(
    'Given invalid zone %s, When validating it, Then it returns false',
    (timeZone) => {
      expect(isValidTimeZone(timeZone as never)).toBe(false);
    },
  );
});
