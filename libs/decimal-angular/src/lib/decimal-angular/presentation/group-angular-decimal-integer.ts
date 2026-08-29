/** Groups decimal integer digits with locale-derived primary and secondary sizes. */
export function groupAngularDecimalInteger(
  integerPart: string,
  primarySize: number,
  secondarySize: number,
  groupSymbol: string,
): string {
  const groups: string[] = [];
  let remaining = integerPart;
  let groupSize = primarySize;
  while (remaining.length > groupSize) {
    groups.unshift(remaining.slice(-groupSize));
    remaining = remaining.slice(0, -groupSize);
    groupSize = secondarySize;
  }
  groups.unshift(remaining);
  return groups.join(groupSymbol);
}
