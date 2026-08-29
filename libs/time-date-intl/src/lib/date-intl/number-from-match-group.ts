import { readMatchGroup } from './read-match-group';

/** Reads a numeric named match group, defaulting an absent group to zero. */
export function numberFromMatchGroup(
  match: RegExpExecArray | undefined,
  name: string,
): number {
  return Number(readMatchGroup(match, name) ?? 0);
}
