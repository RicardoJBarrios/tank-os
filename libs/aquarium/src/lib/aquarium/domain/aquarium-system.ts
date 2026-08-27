import { createAquariumName, type Aquarium, type AquariumId } from './aquarium';

const MAX_COMPONENT_NAME_LENGTH = 120;
const MAX_ZONE_NAME_LENGTH = 120;
const MAX_COMPONENTS = 100;
const MAX_LINKS = 200;
const MAX_ZONES_PER_COMPONENT = 50;

export type AquariumComponentId = string & {
  readonly __aquariumComponentId: unique symbol;
};

export function createAquariumComponentId(value: string): AquariumComponentId {
  const normalized = value.trim();
  if (!normalized) throw new Error('Aquarium component id cannot be empty');
  return normalized as AquariumComponentId;
}

export type AquariumComponentName = string & {
  readonly __aquariumComponentName: unique symbol;
};

export function createAquariumComponentName(
  value: string,
): AquariumComponentName {
  const normalized = value.trim();
  if (!normalized) throw new Error('Aquarium component name cannot be empty');
  if (normalized.length > MAX_COMPONENT_NAME_LENGTH)
    throw new Error(
      `Aquarium component name cannot exceed ${String(MAX_COMPONENT_NAME_LENGTH)} characters`,
    );
  return normalized as AquariumComponentName;
}

export type AquariumComponentKind =
  'display' | 'sump' | 'refugium' | 'quarantine' | 'reservoir' | 'custom';

export interface AquariumDimensions {
  readonly lengthMillimetres: number;
  readonly widthMillimetres: number;
  readonly heightMillimetres: number;
}

export type AquariumZoneKind =
  'mechanical' | 'skimmer' | 'biological' | 'refugium' | 'return' | 'custom';

export type AquariumZoneId = string & {
  readonly __aquariumZoneId: unique symbol;
};

export function createAquariumZoneId(value: string): AquariumZoneId {
  const normalized = value.trim();
  if (!normalized) throw new Error('Aquarium zone id cannot be empty');
  return normalized as AquariumZoneId;
}

export type AquariumZoneName = string & {
  readonly __aquariumZoneName: unique symbol;
};

export function createAquariumZoneName(value: string): AquariumZoneName {
  const normalized = value.trim();
  if (!normalized) throw new Error('Aquarium zone name cannot be empty');
  if (normalized.length > MAX_ZONE_NAME_LENGTH)
    throw new Error(
      `Aquarium zone name cannot exceed ${String(MAX_ZONE_NAME_LENGTH)} characters`,
    );
  return normalized as AquariumZoneName;
}

export interface AquariumZone {
  readonly id: AquariumZoneId;
  readonly name: AquariumZoneName;
  readonly kind: AquariumZoneKind;
  readonly capacityLitres?: number;
}

export interface AquariumComponent {
  readonly id: AquariumComponentId;
  readonly name: AquariumComponentName;
  readonly kind: AquariumComponentKind;
  readonly capacityLitres?: number;
  readonly dimensions?: AquariumDimensions;
  readonly zones?: readonly AquariumZone[];
}

export type AquariumLinkKind = 'water' | 'air' | 'electrical' | 'other';

export interface AquariumLink {
  readonly fromComponentId: AquariumComponentId;
  readonly fromZoneId?: AquariumZoneId;
  readonly toComponentId: AquariumComponentId;
  readonly toZoneId?: AquariumZoneId;
  readonly kind: AquariumLinkKind;
}

export interface AquariumSystemInput {
  readonly id: AquariumId;
  readonly name: string;
  readonly establishedByKeeperId: string;
  readonly establishedAt: Date;
  readonly components?: readonly AquariumComponent[];
  readonly links?: readonly AquariumLink[];
}

function assertFinitePositive(value: number, label: string): void {
  if (!Number.isFinite(value) || value <= 0)
    throw new Error(`${label} must be a finite positive number`);
}

function assertDimensions(dimensions: AquariumDimensions): void {
  assertFinitePositive(dimensions.lengthMillimetres, 'Component length');
  assertFinitePositive(dimensions.widthMillimetres, 'Component width');
  assertFinitePositive(dimensions.heightMillimetres, 'Component height');
}

function assertZone(zone: AquariumZone): void {
  createAquariumZoneId(zone.id);
  createAquariumZoneName(zone.name);
  if (zone.capacityLitres !== undefined)
    assertFinitePositive(zone.capacityLitres, 'Zone capacity');
}

function assertComponent(component: AquariumComponent): void {
  createAquariumComponentId(component.id);
  createAquariumComponentName(component.name);
  if (component.capacityLitres !== undefined)
    assertFinitePositive(component.capacityLitres, 'Component capacity');
  if (component.dimensions !== undefined)
    assertDimensions(component.dimensions);
  const zones = component.zones ?? [];
  if (zones.length > MAX_ZONES_PER_COMPONENT)
    throw new Error(
      `A component cannot contain more than ${String(MAX_ZONES_PER_COMPONENT)} zones`,
    );
  const zoneIds = new Set(zones.map((zone) => zone.id));
  if (zoneIds.size !== zones.length)
    throw new Error('Aquarium zone ids must be unique within a component');
  zones.forEach(assertZone);
}

function assertLinkEndpoint(
  component: AquariumComponent | undefined,
  zoneId: AquariumZoneId | undefined,
  endpoint: string,
): void {
  if (component === undefined)
    throw new Error(
      `Aquarium link ${endpoint} must reference an existing component`,
    );
  if (zoneId === undefined) return;
  const zoneExists = (component.zones ?? []).some((zone) => zone.id === zoneId);
  if (!zoneExists)
    throw new Error(
      `Aquarium link ${endpoint} must reference an existing zone`,
    );
}

function assertSystemTopology(
  components: readonly AquariumComponent[],
  links: readonly AquariumLink[],
): void {
  if (components.length > MAX_COMPONENTS)
    throw new Error(
      `An Aquarium cannot contain more than ${String(MAX_COMPONENTS)} components`,
    );
  if (links.length > MAX_LINKS)
    throw new Error(
      `An Aquarium cannot contain more than ${String(MAX_LINKS)} links`,
    );

  const componentIds = new Set(components.map((component) => component.id));
  if (componentIds.size !== components.length)
    throw new Error('Aquarium component ids must be unique');

  components.forEach(assertComponent);
  const componentsById = new Map(
    components.map((component) => [component.id, component]),
  );
  for (const link of links) {
    assertLinkEndpoint(
      componentsById.get(link.fromComponentId),
      link.fromZoneId,
      'source',
    );
    assertLinkEndpoint(
      componentsById.get(link.toComponentId),
      link.toZoneId,
      'target',
    );
    if (link.fromComponentId === link.toComponentId)
      throw new Error('Aquarium links cannot connect a component to itself');
  }
}

/** Creates the physical-system portion of an Aquarium aggregate. */
export function createAquariumSystem(input: AquariumSystemInput): Aquarium {
  const components = Object.freeze([...(input.components ?? [])]);
  const links = Object.freeze([...(input.links ?? [])]);
  assertSystemTopology(components, links);

  return Object.freeze({
    id: input.id,
    name: createAquariumName(input.name),
    establishedByKeeperId: input.establishedByKeeperId,
    establishedAt: new Date(input.establishedAt.getTime()),
    components,
    links,
  });
}
