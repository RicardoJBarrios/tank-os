/** Formats millisecond precision as a trimmed ISO fractional second. */
export function formatFractionalSeconds(milliseconds: number): string {
  if (milliseconds === 0) return '';
  let fraction = milliseconds.toString().padStart(3, '0');
  while (fraction.endsWith('0')) fraction = fraction.slice(0, -1);
  return `.${fraction}`;
}
