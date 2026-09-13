import { DatePipe } from '@angular/common';
import { TimePort } from '@tankos/time';
import { formatAngularLocalDate } from './format-angular-local-date';

describe('formatAngularLocalDate', () => {
  const port = {
    parseLocalDate: vi
      .fn()
      .mockReturnValue({ kind: 'local-date', year: 1, month: 1, day: 2 }),
    toLocalDateString: vi.fn().mockReturnValue('0001-01-02'),
    fromZonedDateTime: vi.fn().mockReturnValue({
      kind: 'instant',
      epochMilliseconds: -62_135_510_400_000,
    }),
  } as unknown as TimePort;

  it('anchors the calendar day to UTC before delegating', () => {
    const datePipe = new DatePipe('en-US');
    const transform = vi.spyOn(datePipe, 'transform').mockReturnValue('date');
    expect(
      formatAngularLocalDate(datePipe, port, 'input', {
        format: 'fullDate',
        locale: 'es-ES',
      }),
    ).toBe('date');
    expect(port.fromZonedDateTime).toHaveBeenCalledWith(
      '0001-01-02T00:00:00.000',
      'UTC',
    );
    expect(transform).toHaveBeenCalledWith(
      -62_135_510_400_000,
      'fullDate',
      '+0000',
      'es-ES',
    );
  });

  it('returns an empty string when DatePipe cannot format the value', () => {
    const datePipe = new DatePipe('en-US');
    vi.spyOn(datePipe, 'transform').mockReturnValue(null);
    expect(formatAngularLocalDate(datePipe, port, 'input')).toBe('');
  });
});
