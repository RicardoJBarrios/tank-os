import { DurationParts } from './duration-parts';

/** Formats exact duration components as an unbounded-hours digital clock. */
export function formatDigitalDuration(parts: DurationParts): string {
  return [parts.days * 24 + parts.hours, parts.minutes, parts.seconds]
    .map((value) => value.toString().padStart(2, '0'))
    .join(':');
}
