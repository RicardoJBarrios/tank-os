import { validateCalendarPeriod } from './validate-calendar-period';

describe('validateCalendarPeriod', () => {
  it.each([{}, { years: 0, months: -1, days: 2 }])('accepts %s', (value) => {
    expect(() => {
      validateCalendarPeriod(value);
    }).not.toThrow();
  });
  it.each([
    null,
    { years: 1.5 },
    { months: Infinity },
    { days: Number.MAX_SAFE_INTEGER + 1 },
  ])('rejects %s', (value) => {
    expect(() => {
      validateCalendarPeriod(value);
    }).toThrow(RangeError);
  });
});
