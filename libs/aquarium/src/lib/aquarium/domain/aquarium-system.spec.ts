import {
  createAquariumComponentId,
  createAquariumComponentName,
  createAquariumZoneId,
  createAquariumZoneName,
  createAquariumSystem,
} from './aquarium-system';
import { createAquariumId, createAquariumName } from './aquarium';

describe('Aquarium physical system model', () => {
  it('creates a system with structural components and links', () => {
    const display = {
      id: createAquariumComponentId('display'),
      name: createAquariumComponentName('Display tank'),
      kind: 'display' as const,
      capacityLitres: 300,
      dimensions: {
        lengthMillimetres: 1200,
        widthMillimetres: 500,
        heightMillimetres: 600,
      },
      zones: [
        {
          id: createAquariumZoneId('display-water'),
          name: createAquariumZoneName('Display water'),
          kind: 'custom',
        },
      ],
    };
    const sump = {
      id: createAquariumComponentId('sump'),
      name: createAquariumComponentName('Sump'),
      kind: 'sump' as const,
    };

    const aquarium = createAquariumSystem({
      id: createAquariumId('aquarium-1'),
      name: 'Reef system',
      establishedByKeeperId: 'keeper-1',
      establishedAt: new Date('2026-01-01T00:00:00.000Z'),
      components: [display, sump],
      links: [
        { fromComponentId: display.id, toComponentId: sump.id, kind: 'water' },
      ],
    });

    expect(aquarium.components).toEqual([display, sump]);
    expect(aquarium.links[0]).toMatchObject({ kind: 'water' });
  });

  it('rejects links to unknown components and self-links', () => {
    const displayId = createAquariumComponentId('display');
    const display = {
      id: displayId,
      name: createAquariumComponentName('Display'),
      kind: 'display' as const,
    };
    const base = {
      id: createAquariumId('aquarium-1'),
      name: 'System',
      establishedByKeeperId: 'keeper-1',
      establishedAt: new Date(),
      components: [display],
    };

    expect(() =>
      createAquariumSystem({
        ...base,
        links: [
          {
            fromComponentId: displayId,
            toComponentId: displayId,
            kind: 'water',
          },
        ],
      }),
    ).toThrow('cannot connect a component to itself');
  });

  it('rejects invalid component values and duplicate components', () => {
    expect(() => createAquariumComponentId(' ')).toThrow('id cannot be empty');
    expect(() => createAquariumComponentName(' ')).toThrow(
      'name cannot be empty',
    );
    expect(() => createAquariumComponentName('x'.repeat(121))).toThrow(
      'cannot exceed 120',
    );

    const component = {
      id: createAquariumComponentId('display'),
      name: createAquariumComponentName('Display'),
      kind: 'display' as const,
    };
    const base = {
      id: createAquariumId('aquarium-1'),
      name: 'System',
      establishedByKeeperId: 'keeper-1',
      establishedAt: new Date(),
    };

    expect(() =>
      createAquariumSystem({ ...base, components: [component, component] }),
    ).toThrow('ids must be unique');
    expect(() =>
      createAquariumSystem({
        ...base,
        components: [{ ...component, capacityLitres: Number.NaN }],
      }),
    ).toThrow('capacity must be a finite positive number');
    expect(() =>
      createAquariumSystem({
        ...base,
        components: [
          {
            ...component,
            dimensions: {
              lengthMillimetres: 0,
              widthMillimetres: 10,
              heightMillimetres: 10,
            },
          },
        ],
      }),
    ).toThrow('length must be a finite positive number');
  });

  it('validates zones and links to specific zones', () => {
    const displayId = createAquariumComponentId('display');
    const sumpId = createAquariumComponentId('sump');
    const sumpZoneId = createAquariumZoneId('return');
    const display = {
      id: displayId,
      name: createAquariumComponentName('Display'),
      kind: 'display' as const,
    };
    const sump = {
      id: sumpId,
      name: createAquariumComponentName('Sump'),
      kind: 'sump' as const,
      zones: [
        {
          id: sumpZoneId,
          name: createAquariumZoneName('Return chamber'),
          kind: 'return' as const,
          capacityLitres: 40,
        },
      ],
    };
    const base = {
      id: createAquariumId('aquarium-1'),
      name: 'System',
      establishedByKeeperId: 'keeper-1',
      establishedAt: new Date(),
      components: [display, sump],
    };

    const system = createAquariumSystem({
      ...base,
      links: [
        {
          fromComponentId: displayId,
          toComponentId: sumpId,
          toZoneId: sumpZoneId,
          kind: 'water',
        },
      ],
    });
    expect(system.links[0]?.toZoneId).toBe(sumpZoneId);

    expect(() =>
      createAquariumSystem({
        ...base,
        components: [{ ...sump, zones: [sump.zones[0], sump.zones[0]] }],
      }),
    ).toThrow('zone ids must be unique');
    expect(() =>
      createAquariumSystem({
        ...base,
        components: [
          {
            ...sump,
            zones: Array.from({ length: 51 }, (_, index) => ({
              id: createAquariumZoneId(`zone-${String(index)}`),
              name: createAquariumZoneName(`Zone ${String(index)}`),
              kind: 'custom' as const,
            })),
          },
        ],
      }),
    ).toThrow('more than 50 zones');
    expect(() =>
      createAquariumSystem({
        ...base,
        links: [
          {
            fromComponentId: displayId,
            toComponentId: displayId,
            toZoneId: createAquariumZoneId('missing'),
            kind: 'water',
          },
        ],
      }),
    ).toThrow('existing zone');
    expect(() => createAquariumZoneId(' ')).toThrow('id cannot be empty');
    expect(() => createAquariumZoneName(' ')).toThrow('name cannot be empty');
    expect(() => createAquariumZoneName('x'.repeat(121))).toThrow(
      'cannot exceed 120',
    );
  });

  it('rejects invalid topology sizes and link targets', () => {
    const display = {
      id: createAquariumComponentId('display'),
      name: createAquariumComponentName('Display'),
      kind: 'display' as const,
    };
    const sump = {
      id: createAquariumComponentId('sump'),
      name: createAquariumComponentName('Sump'),
      kind: 'sump' as const,
    };
    const base = {
      id: createAquariumId('aquarium-1'),
      name: 'System',
      establishedByKeeperId: 'keeper-1',
      establishedAt: new Date(),
      components: [display, sump],
    };
    const validLink = {
      fromComponentId: display.id,
      toComponentId: sump.id,
      kind: 'water' as const,
    };

    expect(() =>
      createAquariumSystem({ ...base, links: Array(201).fill(validLink) }),
    ).toThrow('more than 200 links');
    expect(() =>
      createAquariumSystem({
        ...base,
        components: Array(101).fill(display),
      }),
    ).toThrow('more than 100 components');
    expect(() =>
      createAquariumSystem({
        ...base,
        links: [
          {
            ...validLink,
            fromComponentId: createAquariumComponentId('missing'),
          },
        ],
      }),
    ).toThrow('source must reference');
    expect(() =>
      createAquariumSystem({
        ...base,
        links: [
          { ...validLink, toComponentId: createAquariumComponentId('missing') },
        ],
      }),
    ).toThrow('target must reference');
  });

  it('validates aquarium identity and supports an empty topology', () => {
    expect(() => createAquariumId(' ')).toThrow('id cannot be empty');
    expect(() => createAquariumName(' ')).toThrow('name cannot be empty');
    expect(() => createAquariumName('x'.repeat(121))).toThrow(
      'cannot exceed 120',
    );

    const system = createAquariumSystem({
      id: createAquariumId('aquarium-1'),
      name: ' System ',
      establishedByKeeperId: 'keeper-1',
      establishedAt: new Date('2026-01-01T00:00:00.000Z'),
    });

    expect(system.name).toBe('System');
    expect(system.components).toEqual([]);
    expect(system.links).toEqual([]);
  });
});
