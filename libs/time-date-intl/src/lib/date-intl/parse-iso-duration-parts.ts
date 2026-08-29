import {
  createIsoDurationParts,
  IsoDurationParts,
} from './create-iso-duration-parts';
import { hasValidIsoDurationMatches } from './has-valid-iso-duration-matches';
import { matchIsoDurationDatePart } from './match-iso-duration-date-part';
import { matchIsoDurationTimePart } from './match-iso-duration-time-part';
import { splitIsoDurationParts } from './split-iso-duration-parts';

/** Parses fixed day/time ISO duration components without applying the sign. */
export function parseIsoDurationParts(
  value: string,
): IsoDurationParts | undefined {
  const texts = splitIsoDurationParts(value);
  if (!texts) return undefined;
  const dateMatch = matchIsoDurationDatePart(texts.date);
  const timeMatch = matchIsoDurationTimePart(texts.time);
  if (!hasValidIsoDurationMatches(texts, dateMatch, timeMatch))
    return undefined;
  return createIsoDurationParts(dateMatch, timeMatch);
}
