import { DateAdapter } from '@angular/material/core';
import { LuxonDateAdapter } from '@angular/material-luxon-adapter';
import { createComponentFactory } from '@ngneat/spectator/vitest';
import { DateTime } from 'luxon';
import { provideTimeAngularTestRuntime } from '../../../test-setup';
import { TimeField } from './time-field';
import { createTimeMaterialFormats } from './time-material-formats';

describe('official Material/Luxon editing contract', () => {
  const create = createComponentFactory({
    component: TimeField,
    providers: [provideTimeAngularTestRuntime()],
  });

  it.each([
    ['es-ES', 3, 4],
    ['en-US', 4, 3],
  ])('delegates regional and ISO parsing in %s', (locale, day, month) => {
    const spectator = create({ props: { locale } });
    const adapter = spectator.fixture.debugElement.injector.get(
      DateAdapter<DateTime>,
    );
    expect(adapter.constructor).toBe(LuxonDateAdapter);
    const value = adapter.parse('03/04/2026', 'D');
    expect(value?.day).toBe(day);
    expect(value?.month).toBe(month);
    expect(adapter.parse('2026-04-03', 'D')?.day).toBe(3);
    expect(adapter.parse('impossible', 'D')?.isValid).toBe(false);
  });

  it('accepts Luxon hour normalization without a Time-specific parser', () => {
    const spectator = create({ props: { locale: 'en-US' } });
    const adapter = spectator.fixture.debugElement.injector.get(
      DateAdapter<DateTime>,
    );
    const format = createTimeMaterialFormats().parse.timeInput;
    expect(adapter.parseTime('24:00', format)?.hour).toBe(0);
    expect(adapter.parseTime('1:30 PM', format)?.hour).toBe(13);
    expect(adapter.parseTime('23:59:58.123', format)?.millisecond).toBe(123);
  });
});
