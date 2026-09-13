import { DateTime } from 'luxon';
import { createComponentFactory } from '@ngneat/spectator/vitest';
import { FormControl } from '@angular/forms';
import { parseLocalTime, type LocalDate } from '@tankos/time';
import { createLuxonRuntime } from '@tankos/time-luxon';
import { provideTimeAngularTestRuntime } from '../../../test-setup';
import { TimeField } from './time-field';

const port = createLuxonRuntime().timePort;

describe('Material presentation contract of TimeField', () => {
  const create = createComponentFactory({
    component: TimeField,
    providers: [provideTimeAngularTestRuntime()],
  });

  it('adapts reactive civil filters and cell classes for both validation and calendar', () => {
    const spectator = create();
    const date: LocalDate = {
      kind: 'local-date',
      year: 2026,
      month: 4,
      day: 3,
    };
    const widgetDate = DateTime.utc(2026, 4, 3);
    const control = new FormControl(date);
    expect(spectator.component.calendarFilter()(null)).toBe(true);
    spectator.setInput('dateFilter', (value: LocalDate) => value.day !== 3);
    expect(spectator.component.calendarFilter()(widgetDate)).toBe(false);
    expect(spectator.component.validate(control)).toEqual({ timeFilter: true });
    spectator.setInput('dateFilter', () => true);
    expect(spectator.component.validate(control)).toBeNull();
    expect(spectator.component.calendarClass()(widgetDate, 'month')).toBe('');
    spectator.setInput('options', { dateClass: () => 'special-day' });
    expect(spectator.component.calendarClass()(widgetDate, 'month')).toBe(
      'special-day',
    );
  });

  it('limits clock selection only on the corresponding instant boundary day', () => {
    const spectator = create({
      props: {
        kind: 'instant',
        timeZone: 'Asia/Kolkata',
        min: port.parseInstant('2026-04-03T08:00:00Z'),
        max: port.parseInstant('2026-04-05T10:00:00Z'),
      },
    });
    const field = spectator.component;
    expect(field.materialBound('min', 'clock')).toBeNull();
    field.dateControl.setValue(DateTime.utc(2026, 4, 3));
    expect(field.materialBound('min', 'clock')?.hour).toBe(13);
    expect(field.materialBound('min', 'clock')?.minute).toBe(30);
    expect(field.materialBound('max', 'clock')).toBeNull();
    field.dateControl.setValue(DateTime.utc(2026, 4, 5));
    expect(field.materialBound('max', 'clock')?.hour).toBe(15);
    field.dateControl.setValue(DateTime.utc(2026, 4, 4));
    expect(field.materialBound('min', 'clock')).toBeNull();
    expect(field.materialBound('max', 'clock')).toBeNull();
  });

  it('maps custom clock options, supports error matchers and blocks overlay opening', () => {
    const spectator = create({
      props: {
        kind: 'local-time',
        options: {
          timeOptions: [
            { value: parseLocalTime('13:30'), label: 'Después de comer' },
          ],
        },
      },
    });
    const field = spectator.component;
    expect(field.clockOptions()?.[0]?.value.hour).toBe(13);
    expect(field.clockOptions()?.[0]?.label).toBe('Después de comer');
    const matcher = { isErrorState: vi.fn().mockReturnValue(true) };
    spectator.setInput('errorStateMatcher', matcher);
    expect(field.errorState.isErrorState()).toBe(true);
    expect(matcher.isErrorState).toHaveBeenCalled();
    field.setDisabledState(true);
    field.open('clock');
    field.setDisabledState(false);
    spectator.setInput('readonly', true);
    field.open();
    expect(spectator.query('.mat-timepicker-panel')).toBeNull();
    field.close();
  });

  it('opens and closes the appropriate calendar and tolerates the absent clock', () => {
    const spectator = create();
    const opened = vi.fn();
    const closed = vi.fn();
    spectator.component.opened.subscribe(opened);
    spectator.component.closed.subscribe(closed);
    spectator.component.open();
    spectator.detectChanges();
    expect(opened).toHaveBeenCalledWith('date');
    spectator.component.close();
    expect(closed).toHaveBeenCalledWith('date');
    spectator.component.open('clock');
    spectator.component.close();
  });
});
