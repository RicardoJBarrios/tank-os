import {
  createAquariumComponentId,
  createAquariumComponentName,
  createAquariumId,
  createAquariumName,
  createAquariumSystem,
  createAquariumZoneId,
  createAquariumZoneName,
  type Aquarium,
} from '@tankos/aquarium';
import { z } from 'zod';

const MAX_SEARCH_TOKENS = 256;
const MAX_NAME_LENGTH = 120;
const MAX_ZONES = 50;
const MAX_COMPONENTS = 100;
const MAX_LINKS = 200;

const dimensionsSchema = z.strictObject({
  lengthMillimetres: z.number().positive(),
  widthMillimetres: z.number().positive(),
  heightMillimetres: z.number().positive(),
});

const zoneSchema = z.strictObject({
  id: z.string().min(1),
  name: z.string().min(1).max(MAX_NAME_LENGTH),
  kind: z.enum([
    'mechanical',
    'skimmer',
    'biological',
    'refugium',
    'return',
    'custom',
  ]),
  capacityLitres: z.number().positive().optional(),
});

const componentSchema = z.strictObject({
  id: z.string().min(1),
  name: z.string().min(1).max(MAX_NAME_LENGTH),
  kind: z.enum([
    'display',
    'sump',
    'refugium',
    'quarantine',
    'reservoir',
    'custom',
  ]),
  capacityLitres: z.number().positive().optional(),
  dimensions: dimensionsSchema.optional(),
  zones: z.array(zoneSchema).max(MAX_ZONES).optional(),
});

const linkSchema = z.strictObject({
  fromComponentId: z.string().min(1),
  fromZoneId: z.string().min(1).optional(),
  toComponentId: z.string().min(1),
  toZoneId: z.string().min(1).optional(),
  kind: z.enum(['water', 'air', 'electrical', 'other']),
});

/** Strict external representation persisted by the Firestore adapter. */
export const aquariumDtoSchema = z.strictObject({
  storageId: z.string().min(1).optional(),
  name: z.string().min(1).max(MAX_NAME_LENGTH),
  establishedByKeeperId: z.string().min(1),
  establishedAt: z.iso.datetime(),
  components: z.array(componentSchema).max(MAX_COMPONENTS),
  links: z.array(linkSchema).max(MAX_LINKS),
  nameSearchTokens: z.array(z.string().min(1)).max(MAX_SEARCH_TOKENS),
});

export type AquariumDto = z.input<typeof aquariumDtoSchema>;

/** Parses a transport DTO into the immutable domain aggregate. */
export const aquariumSchema = aquariumDtoSchema.transform(
  (value, context): Aquarium | typeof z.NEVER => {
    try {
      return createAquariumSystem({
        id: createAquariumId(value.storageId ?? 'unassigned'),
        name: createAquariumName(value.name),
        establishedByKeeperId: value.establishedByKeeperId,
        establishedAt: new Date(value.establishedAt),
        components: value.components.map((component) => ({
          ...component,
          id: createAquariumComponentId(component.id),
          name: createAquariumComponentName(component.name),
          zones: component.zones?.map((zone) => ({
            ...zone,
            id: createAquariumZoneId(zone.id),
            name: createAquariumZoneName(zone.name),
          })),
        })),
        links: value.links.map((link) => ({
          ...link,
          fromComponentId: createAquariumComponentId(link.fromComponentId),
          fromZoneId: link.fromZoneId
            ? createAquariumZoneId(link.fromZoneId)
            : undefined,
          toComponentId: createAquariumComponentId(link.toComponentId),
          toZoneId: link.toZoneId
            ? createAquariumZoneId(link.toZoneId)
            : undefined,
        })),
      });
    } catch (error) {
      context.addIssue({ code: 'custom', message: String(error) });
      return z.NEVER;
    }
  },
);

/** Serializes the aggregate without leaking branded domain types. */
export function aquariumToDto(
  aquarium: Aquarium,
  storageId?: string,
): AquariumDto {
  return {
    ...(storageId === undefined ? {} : { storageId }),
    name: aquarium.name,
    establishedByKeeperId: aquarium.establishedByKeeperId,
    establishedAt: aquarium.establishedAt.toISOString(),
    components: aquarium.components.map((component) => ({
      ...component,
      zones: component.zones?.map((zone) => ({ ...zone })),
    })),
    links: aquarium.links.map((link) => ({ ...link })),
    nameSearchTokens: searchTokens(aquarium.name),
  };
}

function searchTokens(value: string): string[] {
  const normalized = value.trim().toLocaleLowerCase();
  const tokens = new Set<string>();
  for (let length = 2; length <= 3; length += 1) {
    for (let start = 0; start <= normalized.length - length; start += 1)
      tokens.add(normalized.slice(start, start + length));
  }
  tokens.add(normalized);
  return [...tokens].slice(0, MAX_SEARCH_TOKENS);
}

/** Returns a bounded candidate token for partial name search. */
export function aquariumSearchToken(value: string): string | undefined {
  const normalized = value.trim().toLocaleLowerCase();
  return normalized.length >= 2 ? normalized.slice(0, 2) : undefined;
}
