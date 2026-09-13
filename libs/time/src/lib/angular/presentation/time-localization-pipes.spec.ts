import { DatePipe, registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { createServiceFactory } from '@ngneat/spectator/vitest';
import { provideTimeAngularTestRuntime } from '../../../test-setup';
import { InstantPipe } from './instant.pipe';
import { LocalDatePipe } from './local-date.pipe';
import { LocalTimePipe } from './local-time.pipe';

registerLocaleData(es);

describe('real Angular regional formatting parity', () => {
  const instant = createServiceFactory({
    service: InstantPipe,
    providers: [provideTimeAngularTestRuntime()],
  });
  const date = createServiceFactory({
    service: LocalDatePipe,
    providers: [provideTimeAngularTestRuntime()],
  });
  const clock = createServiceFactory(LocalTimePipe);

  it.each([
    'short',
    'medium',
    'long',
    'full',
    'shortDate',
    'mediumDate',
    'longDate',
    'fullDate',
    'shortTime',
    'mediumTime',
    'longTime',
    'fullTime',
    'yyyy-MM-dd HH:mm:ss.SSS Z',
  ])('matches DatePipe for instant pattern %s', (format) => {
    const pipe = instant().service;
    for (const locale of ['es-ES', 'en-US']) {
      expect(pipe.transform(0, format, 'UTC', locale)).toBe(
        new DatePipe(locale).transform(0, format, 'UTC'),
      );
    }
  });

  it('formats civil fields regionally without leaking reference date or timezone', () => {
    expect(date().service.transform('2026-04-03', 'fullDate', 'es-ES')).toBe(
      'viernes, 3 de abril de 2026',
    );
    const pipe = clock().service;
    expect(pipe.transform('13:30', 'shortTime', 'es-ES')).toBe('13:30');
    expect(pipe.transform('13:30', 'shortTime', 'en-US')).toBe(
      new DatePipe('en-US').transform(
        '2000-01-01T13:30:00Z',
        'shortTime',
        'UTC',
      ),
    );
    expect(() => pipe.transform('13:30', 'yyyy')).toThrow(RangeError);
  });
});
