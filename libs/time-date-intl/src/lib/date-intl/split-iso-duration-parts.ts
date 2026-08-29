/** Date and time texts extracted from an ISO duration. */
export interface IsoDurationPartTexts {
  date?: string;
  time?: string;
}

/** Removes sign/designator and separates ISO duration date and time parts. */
export function splitIsoDurationParts(
  value: string,
): IsoDurationPartTexts | undefined {
  const unsigned =
    value.startsWith('-') || value.startsWith('+') ? value.slice(1) : value;
  if (!unsigned.startsWith('P')) return undefined;
  const body = unsigned.slice(1);
  const separator = body.indexOf('T');
  const date = separator < 0 ? body : body.slice(0, separator);
  return {
    date: date === '' ? undefined : date,
    time: separator < 0 ? undefined : `T${body.slice(separator + 1)}`,
  };
}
