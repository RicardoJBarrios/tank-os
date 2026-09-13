const MAX_OFFSET_HOURS = 23;
const MAX_OFFSET_MINUTES = 59;

/** Validates and removes the colon from an explicit DatePipe offset. */
export function formatDatePipeFixedOffset(
  timeZone: string,
  match: RegExpExecArray,
): string {
  const groups = match.groups as Record<string, string>;
  const { sign, hours: hourText, minutes: minuteText } = groups;
  if (
    Number(hourText) > MAX_OFFSET_HOURS ||
    Number(minuteText) > MAX_OFFSET_MINUTES
  ) {
    throw new RangeError(`Invalid fixed time-zone offset: ${timeZone}`);
  }
  return `${sign}${hourText}${minuteText}`;
}
