import { createIsoDurationParts } from './create-iso-duration-parts';
import { matchIsoDurationDatePart } from './match-iso-duration-date-part';
import { matchIsoDurationTimePart } from './match-iso-duration-time-part';

it('creates numeric parts and defaults missing units to zero', () => {
  expect(
    createIsoDurationParts(
      matchIsoDurationDatePart('2D'),
      matchIsoDurationTimePart('T3H4.5S'),
    ),
  ).toEqual({ days: 2, hours: 3, minutes: 0, seconds: 4, fraction: '5' });
});

it('creates zeroed parts when both validated matches are absent', () => {
  expect(createIsoDurationParts(undefined, undefined)).toEqual({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    fraction: undefined,
  });
});
