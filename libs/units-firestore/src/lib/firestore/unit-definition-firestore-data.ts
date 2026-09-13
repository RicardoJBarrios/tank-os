import {
  type UnitDefinition,
  type UnitDefinitionDto,
  unitDefinitionDtoSchema,
  unitDefinitionSchema,
  unitDefinitionToDto,
} from '@tankos/units';
import { z } from 'zod';

const MAX_CODE_LENGTH = 128;
const MAX_OWNER_NAME_LENGTH = 256;
const MAX_SEARCH_TOKENS = 1024;

/** Firestore-only projection layered over the canonical Units DTO. */
export const unitDefinitionFirestoreDataSchema = unitDefinitionDtoSchema.extend(
  {
    storageId: z.string().min(1).optional(),
    codeSearchTokens: z
      .array(z.string().min(1).max(MAX_CODE_LENGTH))
      .max(MAX_SEARCH_TOKENS),
    ownerSearchTokens: z
      .array(z.string().min(1).max(MAX_OWNER_NAME_LENGTH))
      .max(MAX_SEARCH_TOKENS)
      .optional(),
  },
);

export type UnitDefinitionFirestoreData = z.input<
  typeof unitDefinitionFirestoreDataSchema
>;

export function unitDefinitionToFirestoreData(
  definition: UnitDefinition,
  storageId?: string,
): UnitDefinitionFirestoreData {
  return {
    ...unitDefinitionToDto(definition),
    ...(storageId === undefined ? {} : { storageId }),
    codeSearchTokens: searchTokens(definition.code),
    ...(definition.ownerName === undefined
      ? {}
      : { ownerSearchTokens: searchTokens(definition.ownerName) }),
  };
}

export function unitDefinitionFromFirestoreData(
  data: UnitDefinitionFirestoreData,
): UnitDefinition {
  const dto: UnitDefinitionDto = {
    code: data.code,
    ...(data.ownerId === undefined ? {} : { ownerId: data.ownerId }),
    ...(data.ownerName === undefined ? {} : { ownerName: data.ownerName }),
    visibility: data.visibility,
    system: data.system,
    representation: data.representation,
    catalogueVersion: data.catalogueVersion,
  };
  return unitDefinitionSchema.parse(dto satisfies UnitDefinitionDto);
}

/** Returns the bounded token used to find partial-search candidates. */
export function unitDefinitionSearchToken(value: string): string | undefined {
  const normalized = value.trim().toLocaleLowerCase();
  return normalized.length >= 2 ? normalized.slice(0, 2) : undefined;
}

function searchTokens(value: string): string[] {
  const normalized = value.trim().toLocaleLowerCase();
  const tokens = new Set<string>();
  if (!normalized) return [];
  if (normalized.length < 2) return [normalized];

  // Firestore array indexes have a per-document entry limit. Two- and
  // three-grams preserve partial candidate search with linear fan-out; the
  // UI performs the final substring check against the returned candidates.
  for (let length = 2; length <= 3; length += 1) {
    for (let start = 0; start <= normalized.length - length; start += 1) {
      tokens.add(normalized.slice(start, start + length));
    }
  }
  tokens.add(normalized);
  return [...tokens];
}
