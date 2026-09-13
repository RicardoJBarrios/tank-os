import '@angular/compiler';
import '@angular/localize/init';
import '@analogjs/vitest-angular/setup-snapshots';
import { setupTestBed } from '@analogjs/vitest-angular/setup-testbed';
import { createLuxonRuntime } from '@tankos/time-luxon';
import { provideTimeAngular } from './lib/angular/composition';

setupTestBed();

/** Provides the real Date/Intl runtime for Angular integration tests only. */
export function provideTimeAngularTestRuntime() {
  return provideTimeAngular(createLuxonRuntime());
}
