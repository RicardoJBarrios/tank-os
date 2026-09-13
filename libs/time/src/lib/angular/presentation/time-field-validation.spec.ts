import { DateTime } from 'luxon';
import { createComponentFactory } from '@ngneat/spectator/vitest';
import { FormControl } from '@angular/forms';
import { createLuxonRuntime } from '@tankos/time-luxon';
import { parseLocalTime } from '@tankos/time';
import { provideTimeAngularTestRuntime } from '../../../test-setup';
import { TimeField } from './time-field';
import type { TimeFieldValue } from './time-field-codec';

const port = createLuxonRuntime().timePort;

describe('temporal editor validation and composition', () => {
  const create = createComponentFactory({
    component: TimeField,
    providers: [provideTimeAngularTestRuntime()],
  });

  it('requires both instant fields and delegates DST resolution to Luxon', () => {
    const spectator = create({
      props: { kind: 'instant', timeZone: 'Atlantic/Canary' },
    });
    const component = spectator.component;
    const control = new FormControl<TimeFieldValue | null>(null);
    component.registerOnChange((value) => {
      control.setValue(value);
    });
    component.dateControl.setValue(DateTime.utc(2026, 3, 29, 12));
    component.changed();
    expect(component.validate(control)).toEqual({ timeParse: true });
    component.clockControl.setValue(DateTime.utc(2000, 1, 1, 1, 30));
    component.changed();
    expect(component.validate(control)).toBeNull();
    component.dateControl.setValue(DateTime.utc(2026, 10, 25, 12));
    component.changed();
    expect(component.validate(control)).toBeNull();
    component.clockControl.setValue(DateTime.utc(2000, 1, 1, 3, 30));
    component.changed();
    expect(component.validate(control)).toBeNull();
    expect(control.value).toEqual(port.parseInstant('2026-10-25T03:30:00Z'));
    expect(spectator.query('mat-hint')?.textContent).toBe('Atlantic/Canary');
  });

  it('preserves an existing resolved instant and its milliseconds across zone changes', () => {
    const spectator = create({ props: { kind: 'instant', timeZone: 'UTC' } });
    const component = spectator.component;
    const change = vi.fn();
    component.registerOnChange(change);
    const value = port.parseInstant('2026-06-01T12:30:45.123Z');
    component.writeValue(value);
    spectator.setInput('timeZone', 'Asia/Kolkata');
    expect(component.clockControl.value?.hour).toBe(18);
    expect(component.clockControl.value?.millisecond).toBe(123);
    expect(change).not.toHaveBeenCalled();
    component.changed();
    expect(change).toHaveBeenCalledExactlyOnceWith(value);
  });

  it('rejects missing zones, incompatible values and incompatible bounds', () => {
    const spectator = create({ props: { kind: 'instant' } });
    const component = spectator.component;
    const control = new FormControl<TimeFieldValue | null>(
      port.parseInstant(0),
    );
    component.writeValue(control.value);
    expect(component.validate(control)).toEqual({ timeParse: true });
    spectator.setInput('timeZone', 'UTC');
    component.writeValue(control.value);
    expect(component.validate(control)).toBeNull();
    spectator.setInput('min', parseLocalTime('00:00'));
    expect(component.validate(control)).toEqual({ timeParse: true });
    spectator.setInput('min', undefined);
    control.setValue(parseLocalTime('12:00'));
    expect(component.validate(control)).toEqual({ timeParse: true });
  });

  it('supports optional empty values, independent blur/focus and recovery after invalid writes', () => {
    const spectator = create({ props: { kind: 'local-time' } });
    const component = spectator.component;
    const control = new FormControl<TimeFieldValue | null>(null);
    component.markTouched();
    component.changed();
    expect(component.validate(control)).toBeNull();
    expect(component.errorState.isErrorState()).toBe(false);
    component.focus();
    expect(document.activeElement).toBe(spectator.query('input'));
    component.writeValue(port.parseInstant(0));
    expect(component.validate(control)).toEqual({ timeParse: true });
    component.writeValue(null);
    expect(component.validate(control)).toBeNull();
  });
});
