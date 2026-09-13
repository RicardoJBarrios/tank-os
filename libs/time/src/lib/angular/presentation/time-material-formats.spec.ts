import { createTimeMaterialFormats } from './time-material-formats';

it('provides per-field copies of the official Luxon formats with explicit time parsing', () => {
  const first = createTimeMaterialFormats();
  const second = createTimeMaterialFormats();
  expect(first.parse.dateInput).toBe('D');
  expect(first.parse.timeInput).toContain('HH:mm:ss.SSS');
  expect(first.display.timeInput).toBe('t');
  expect(first.display).not.toBe(second.display);
});
