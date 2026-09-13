import type { UnitDefinition } from '../core';
import type { UnitDefinitionDto } from './unit-definition-zod-schema';

/** Serializes an immutable unit definition into its strict external DTO. */
export function unitDefinitionToDto(
  definition: UnitDefinition,
): UnitDefinitionDto {
  return {
    code: definition.code,
    ...(definition.ownerId === undefined
      ? {}
      : { ownerId: definition.ownerId }),
    ...(definition.ownerName === undefined
      ? {}
      : { ownerName: definition.ownerName }),
    visibility: definition.visibility,
    system: definition.system,
    representation: { ...definition.representation },
    catalogueVersion: definition.catalogueVersion,
  };
}
