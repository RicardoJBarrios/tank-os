/** Symbols and grouping sizes read from the locale selected by Angular. */
export interface AngularDecimalLocaleData {
  readonly group: string;
  readonly decimal: string;
  readonly minus: string;
  readonly primaryGroupingSize: number;
  readonly secondaryGroupingSize: number;
}

const LOCALE_SAMPLE = -123_456_789.5;

/** Reads formatting metadata without converting the Decimal value to number. */
export function createAngularDecimalLocaleData(
  locale: string,
): AngularDecimalLocaleData {
  const parts = new Intl.NumberFormat(locale, {
    useGrouping: true,
  }).formatToParts(LOCALE_SAMPLE);
  const integerParts = parts
    .filter((part) => part.type === 'integer')
    .map((part) => part.value);
  const lastInteger = integerParts[integerParts.length - 1];
  const penultimateInteger = integerParts[integerParts.length - 2];
  const group = findLocalePart(parts, 'group');
  const decimal = findLocalePart(parts, 'decimal');
  const minus = findLocalePart(parts, 'minusSign');
  return {
    group: group.value,
    decimal: decimal.value,
    minus: minus.value,
    primaryGroupingSize: lastInteger.length,
    secondaryGroupingSize: penultimateInteger.length,
  };
}

function findLocalePart(
  parts: readonly Intl.NumberFormatPart[],
  type: Intl.NumberFormatPartTypes,
): Intl.NumberFormatPart {
  const part = parts.find((candidate) => candidate.type === type);
  /* c8 ignore next -- the fixed locale sample always produces each requested part. */
  if (!part) throw new TypeError(`Locale does not provide ${type}`);
  return part;
}
