import '@angular/compiler';
import '@analogjs/vitest-angular/setup-snapshots';
import { setupTestBed } from '@analogjs/vitest-angular/setup-testbed';
import { createDateIntlRuntime } from '@tankos/time-date-intl';
import { provideTimeAngular } from './lib/time-angular/composition';

setupTestBed();

/** Provides the real Date/Intl runtime for Angular integration tests only. */
export function provideTimeAngularTestRuntime() {
  return provideTimeAngular(createDateIntlRuntime());
}
