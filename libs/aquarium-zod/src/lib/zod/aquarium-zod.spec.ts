import { describe, expect, it } from 'vitest';
import {
  aquariumSchema,
  aquariumSearchToken,
  aquariumToDto,
} from './aquarium-zod';

const dto = {
  storageId: 'aquarium-1',
  name: 'Home reef',
  establishedByKeeperId: 'keeper-1',
  establishedAt: '2026-01-01T00:00:00.000Z',
  components: [
    {
      id: 'display',
      name: 'Display tank',
      kind: 'display' as const,
      zones: undefined,
    },
    {
      id: 'sump',
      name: 'Sump',
      kind: 'sump' as const,
      zones: [
        { id: 'return', name: 'Return chamber', kind: 'return' as const },
      ],
    },
  ],
  links: [
    {
      fromComponentId: 'display',
      toComponentId: 'sump',
      toZoneId: 'return',
      kind: 'water' as const,
    },
  ],
  nameSearchTokens: ['ho', 'om', 'hom', 'home'],
};

describe('aquariumSchema', () => {
  it('maps component zones and links into the domain aggregate', () => {
    const aquarium = aquariumSchema.parse(dto);

    expect(aquarium.components[1]?.zones?.[0]?.name).toBe('Return chamber');
    expect(aquarium.links[0]?.toZoneId).toBe('return');
  });

  it('rejects unknown persisted fields', () => {
    expect(() => aquariumSchema.parse({ ...dto, unexpected: true })).toThrow();
  });

  it('rejects topology invariants reported by the domain', () => {
    expect(() =>
      aquariumSchema.parse({
        ...dto,
        components: [dto.components[0], dto.components[0]],
      }),
    ).toThrow();
  });

  it('supports a topology without zones and a missing transport id', () => {
    const aquarium = aquariumSchema.parse({
      ...dto,
      storageId: undefined,
      components: [dto.components[0]],
      links: [],
    });

    expect(aquarium.id).toBe('unassigned');
    expect(aquariumToDto(aquarium).components[0]?.zones).toBeUndefined();
  });

  it('serializes the aggregate and creates bounded search tokens', () => {
    const aquarium = aquariumSchema.parse(dto);

    expect(aquariumToDto(aquarium).nameSearchTokens).toContain('hom');
    expect(aquariumToDto(aquarium).establishedAt).toBe(dto.establishedAt);
  });

  it('returns no search token for a one-character query', () => {
    expect(aquariumSearchToken('x')).toBeUndefined();
    expect(aquariumSearchToken(' HOME ')).toBe('ho');
  });
});
