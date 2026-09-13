/** Technical audit and idempotency metadata attached to a persistence mutation. */
export interface MutationMetadata {
  readonly actorId: string;
  readonly requestId?: string;
}

/** Validates and snapshots mutation metadata at the data-access boundary. */
export function createMutationMetadata(
  metadata: MutationMetadata,
): MutationMetadata {
  if (!metadata.actorId.trim()) {
    throw new TypeError('Mutation metadata requires a non-empty actorId');
  }
  if (metadata.requestId !== undefined && !metadata.requestId.trim()) {
    throw new TypeError('Mutation requestId must be non-empty when provided');
  }
  return { ...metadata };
}
