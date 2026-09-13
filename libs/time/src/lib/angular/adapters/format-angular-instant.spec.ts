import { DatePipe } from '@angular/common';
import { TimePort, TimeZoneDatabasePort } from '@tankos/time';
import { formatAngularInstant } from './format-angular-instant';

describe('formatAngularInstant', () => {
  const port = {
    parseInstant: vi
      .fn()
      .mockReturnValue({ kind: 'instant', epochMilliseconds: 1_000 }),
  } as unknown as TimePort;
  const database = {
    getOffsetMinutes: vi.fn().mockReturnValue(60),
  } as unknown as TimeZoneDatabasePort;

  it('delegates normalized values and explicit presentation options to DatePipe', () => {
    const datePipe = new DatePipe('en-US');
    const transform = vi
      .spyOn(datePipe, 'transform')
      .mockReturnValue('formatted');
    expect(
      formatAngularInstant(datePipe, port, database, 'UTC', 'input', {
        format: 'full',
        timeZone: 'Europe/Madrid',
        locale: 'es-ES',
      }),
    ).toBe('formatted');
    expect(transform).toHaveBeenCalledWith(1_000, 'full', '+0100', 'es-ES');
  });

  it('returns an empty string when DatePipe cannot format the value', () => {
    const datePipe = new DatePipe('en-US');
    vi.spyOn(datePipe, 'transform').mockReturnValue(null);
    expect(formatAngularInstant(datePipe, port, database, 'UTC', 'input')).toBe(
      '',
    );
  });

  it('honors Angular default formats and explicit overrides', () => {
    const pipe = new DatePipe('en-US', undefined, { dateFormat: 'yyyy' });
    expect(formatAngularInstant(pipe, port, database, 'UTC', 'input')).toBe(
      '1970',
    );
    expect(
      formatAngularInstant(pipe, port, database, 'UTC', 'input', {
        format: 'MM',
      }),
    ).toBe('01');
  });
});
