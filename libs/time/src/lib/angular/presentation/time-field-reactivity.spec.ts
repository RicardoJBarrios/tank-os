import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormField, form } from '@angular/forms/signals';
import { createComponentFactory } from '@ngneat/spectator/vitest';
import type { Instant } from '@tankos/time';
import { provideTimeAngularTestRuntime } from '../../../test-setup';
import { TimeField } from './time-field';
import { createTimeMaterialFormats } from './time-material-formats';

@Component({
  imports: [ReactiveFormsModule, FormField, TimeField],
  template: `<tankos-time-field
      [formControl]="control"
      kind="instant"
      [locale]="locale()"
      [timeZone]="zone()"
    />
    <tankos-time-field
      [formField]="fields.instant"
      kind="instant"
      [locale]="locale()"
      [timeZone]="zone()"
    />`,
})
class PreferenceHost {
  public readonly locale = signal('en-US');
  public readonly zone = signal('UTC');
  public readonly control = new FormControl<Instant | null>({
    kind: 'instant',
    epochMilliseconds: 0,
  });
  public readonly model = signal<{ instant: Instant | null }>({
    instant: { kind: 'instant', epochMilliseconds: 0 },
  });
  public readonly fields = form(this.model);
}

describe('dynamic user preferences with both Angular form APIs', () => {
  const create = createComponentFactory({
    component: PreferenceHost,
    providers: [provideTimeAngularTestRuntime()],
  });
  const field = createComponentFactory({
    component: TimeField,
    providers: [provideTimeAngularTestRuntime()],
  });

  it('reformats locale and timezone without emitting edits, then resolves new edits in the new zone', async () => {
    const spectator = create();
    await spectator.fixture.whenStable();
    const changed = vi.fn();
    spectator.component.control.valueChanges.subscribe(changed);
    spectator.component.locale.set('es-ES');
    spectator.component.zone.set('Asia/Kolkata');
    spectator.detectChanges();
    await spectator.fixture.whenStable();
    const clocks = spectator.queryAll<HTMLInputElement>(
      'input[role="combobox"]',
    );
    expect(clocks[0].value).toBe('5:30');
    expect(clocks[1].value).toBe('5:30');
    expect(changed).not.toHaveBeenCalled();
    expect(spectator.component.control.pristine).toBe(true);
    expect(spectator.component.fields.instant().dirty()).toBe(false);
    expect(spectator.component.model().instant?.epochMilliseconds).toBe(0);
    spectator.typeInElement('06:00', clocks[0]);
    spectator.typeInElement('06:00', clocks[1]);
    await spectator.fixture.whenStable();
    expect(spectator.component.control.value?.epochMilliseconds).toBe(
      1_800_000,
    );
    expect(spectator.component.model().instant?.epochMilliseconds).toBe(
      1_800_000,
    );
  });

  it('uses per-field Material format overrides reactively', () => {
    const spectator = field({ props: { kind: 'local-time', locale: 'en-US' } });
    const changed = vi.fn();
    spectator.component.registerOnChange(changed);
    spectator.component.writeValue({
      kind: 'local-time',
      hour: 13,
      minute: 30,
      second: 45,
      millisecond: 123,
    });
    const formats = createTimeMaterialFormats();
    spectator.setInput('formats', {
      ...formats,
      display: { ...formats.display, timeInput: 'HH:mm:ss.SSS' },
    });
    expect(spectator.query<HTMLInputElement>('input')?.value).toBe(
      '13:30:45.123',
    );
    expect(changed).not.toHaveBeenCalled();
  });
});
