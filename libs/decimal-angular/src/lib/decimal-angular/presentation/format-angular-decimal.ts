import { normalizeDecimalInput, type DecimalValue } from '@tankos/decimal';
import { createAngularDecimalLocaleData } from './create-angular-decimal-locale-data';
import { groupAngularDecimalInteger } from './group-angular-decimal-integer';

const NEGATIVE_SIGN = /^-/u;

/** Formats a canonical decimal without coercing it through JavaScript number. */
export function formatAngularDecimal(
  value: DecimalValue | string,
  locale: string,
): string {
  const normalized = normalizeDecimalInput(value);
  const localeData = createAngularDecimalLocaleData(locale);
  const sign = normalized.startsWith('-') ? localeData.minus : '';
  const unsigned = normalized.replace(NEGATIVE_SIGN, '');
  const [integerPart, fractionalPart] = unsigned.split('.');
  const groupedInteger = groupAngularDecimalInteger(
    integerPart,
    localeData.primaryGroupingSize,
    localeData.secondaryGroupingSize,
    localeData.group,
  );
  const fraction = fractionalPart ? `${localeData.decimal}${fractionalPart}` : '';
  return `${sign}${groupedInteger}${fraction}`;
}
