import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import localeHi from '@angular/common/locales/hi';
import { formatAngularDecimal } from './format-angular-decimal';

registerLocaleData(localeEs);
registerLocaleData(localeHi);

describe('formatAngularDecimal', () => {
  it('formats a large canonical decimal without Number coercion', () => {
    expect(formatAngularDecimal('9007199254740993.25', 'en-US')).toBe(
      '9,007,199,254,740,993.25',
    );
  });

  it('uses the Angular locale decimal and minus symbols', () => {
    expect(formatAngularDecimal('-1234.5', 'es-ES')).toBe('-1.234,5');
    expect(formatAngularDecimal('1234', 'es-ES')).toBe('1.234');
  });

  it('uses the grouping pattern registered by Angular for the locale', () => {
    expect(formatAngularDecimal('12345678', 'hi')).toBe('1,23,45,678');
  });
});
