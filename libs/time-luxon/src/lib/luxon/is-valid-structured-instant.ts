/** Candidate structured instant from an external boundary. */
export type StructuredInstantCandidate = {
  readonly kind?: unknown;
  readonly epochMilliseconds?: unknown;
} | null;

/** Narrows a candidate to a structured instant with numeric epoch milliseconds. */
export function isValidStructuredInstant(
  candidate: StructuredInstantCandidate,
): candidate is {
  readonly kind: 'instant';
  readonly epochMilliseconds: number;
} {
  return (
    candidate !== null &&
    typeof candidate === 'object' &&
    candidate.kind === 'instant' &&
    typeof candidate.epochMilliseconds === 'number'
  );
}
