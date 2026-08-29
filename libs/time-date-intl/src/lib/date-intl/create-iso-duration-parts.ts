import { numberFromMatchGroup } from './number-from-match-group';
import { readMatchGroup } from './read-match-group';

/** Parsed fixed-unit components of an ISO duration. */
export interface IsoDurationParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  fraction?: string;
}

/** Creates numeric ISO duration parts from already validated matches. */
export function createIsoDurationParts(
  dateMatch: RegExpExecArray | undefined,
  timeMatch: RegExpExecArray | undefined,
): IsoDurationParts {
  return {
    days: numberFromMatchGroup(dateMatch, 'days'),
    hours: numberFromMatchGroup(timeMatch, 'hours'),
    minutes: numberFromMatchGroup(timeMatch, 'minutes'),
    seconds: numberFromMatchGroup(timeMatch, 'seconds'),
    fraction: readMatchGroup(timeMatch, 'fraction'),
  };
}
