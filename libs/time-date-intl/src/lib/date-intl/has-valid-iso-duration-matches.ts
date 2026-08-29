import { IsoDurationPartTexts } from './split-iso-duration-parts';

/** Verifies that every supplied ISO duration part matched and one part exists. */
export function hasValidIsoDurationMatches(
  texts: IsoDurationPartTexts,
  dateMatch: RegExpExecArray | undefined,
  timeMatch: RegExpExecArray | undefined,
): boolean {
  const dateIsValid = texts.date === undefined || dateMatch !== undefined;
  const timeIsValid = texts.time === undefined || timeMatch !== undefined;
  return (
    dateIsValid &&
    timeIsValid &&
    (dateMatch !== undefined || timeMatch !== undefined)
  );
}
