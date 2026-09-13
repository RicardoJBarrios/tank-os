import type { UnitDefinition } from '@tankos/units';
import type { MutationMetadata } from '@tankos/data-access';

export function createUnitDefinitionId(input: UnitDefinition): string {
  return normalizeIdPart(input.code);
}

/** Version ids are distinct while the canonical code id remains reserved. */
export function createUnitDefinitionReplacementId(
  input: UnitDefinition,
  metadata: MutationMetadata,
): string {
  return `${normalizeIdPart(input.code)}-revision-${normalizeIdPart(metadata.requestId ?? 'unknown')}`;
}

function normalizeIdPart(value: string): string {
  return value.replace(/[^0-9A-Za-z]+/gu, '-').toLowerCase();
}
