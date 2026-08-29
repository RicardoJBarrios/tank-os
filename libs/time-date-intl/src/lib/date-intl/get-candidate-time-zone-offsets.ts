import { getTimeZoneOffset } from './get-time-zone-offset';

const HOURS_IN_SAMPLE_WINDOW = 48;
const MINUTES_PER_HOUR = 60;
const MILLISECONDS_PER_MINUTE = 60_000;
const SAMPLE_INTERVAL_MINUTES = 30;

/** Samples every distinct IANA offset around a local date-time candidate. */
export function getCandidateTimeZoneOffsets(
  timestamp: number,
  timeZone: string,
): Set<number> {
  const offsets = new Set<number>();
  const sampleWindow =
    HOURS_IN_SAMPLE_WINDOW * MINUTES_PER_HOUR * MILLISECONDS_PER_MINUTE;
  const sampleStep = SAMPLE_INTERVAL_MINUTES * MILLISECONDS_PER_MINUTE;
  for (
    let sample = timestamp - sampleWindow;
    sample <= timestamp + sampleWindow;
    sample += sampleStep
  )
    offsets.add(getTimeZoneOffset(sample, timeZone));
  return offsets;
}
