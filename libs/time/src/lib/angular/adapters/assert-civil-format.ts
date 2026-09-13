const DATE_FORBIDDEN = /[BHOSZabhmsz]/u;
const TIME_FORBIDDEN = /[EGLMOWYZcdwyz]/u;

/** Rejects patterns that would manufacture fields absent from a civil value. */
export function assertCivilFormat(format: string, kind: 'date' | 'time'): void {
  const aliases =
    kind === 'date'
      ? ['shortDate', 'mediumDate', 'longDate', 'fullDate']
      : ['shortTime', 'mediumTime'];
  if (aliases.includes(format)) return;
  if (
    ['short', 'medium', 'long', 'full', 'longTime', 'fullTime'].includes(format)
  )
    throw new RangeError('Format contains fields absent from a civil value');
  const tokens = format.replace(/'(?:[^']|'')*'/gu, '');
  const forbidden = kind === 'date' ? DATE_FORBIDDEN : TIME_FORBIDDEN;
  if (forbidden.test(tokens))
    throw new RangeError(`Format contains fields absent from a civil ${kind}`);
}
