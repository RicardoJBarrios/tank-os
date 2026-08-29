import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { LOCALE_ID } from '@angular/core';
import { createServiceFactory } from '@ngneat/spectator/vitest';
import { DecimalPipe } from './decimal.pipe';

registerLocaleData(localeEs);

describe('DecimalPipe', () => {
  const createPipe = createServiceFactory({
    service: DecimalPipe,
    providers: [{ provide: LOCALE_ID, useValue: 'es-ES' }],
  });

  it('renders a decimal with Angular locale and preserves null', () => {
    const pipe = createPipe().service;

    expect(pipe.transform('1234.5')).toBe('1.234,5');
    expect(pipe.transform(null)).toBeNull();
    expect(pipe.transform(undefined)).toBeNull();
  });
});
