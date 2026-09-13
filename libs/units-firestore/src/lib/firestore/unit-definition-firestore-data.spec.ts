import {
  createUnitCode,
  createUnitDefinition,
  createUnitRepresentation,
} from '@tankos/units';
import {
  unitDefinitionFromFirestoreData,
  unitDefinitionSearchToken,
  unitDefinitionToFirestoreData,
} from './unit-definition-firestore-data';

describe('unit-definition Firestore data', () => {
  const definition = createUnitDefinition({
    code: createUnitCode('TANKOS:ABCDEFGHIJKL'),
    ownerId: 'keeper-1',
    ownerName: 'Keeper One',
    system: 'custom',
    representation: createUnitRepresentation({
      symbol: 'u',
      asciiFallback: 'u',
      position: 'suffix',
      spacing: 'normal',
    }),
    catalogueVersion: 'v1',
    visibility: 'public',
  });

  it('adds bounded Firestore search metadata without changing the canonical DTO', () => {
    const data = unitDefinitionToFirestoreData(definition, 'unit-1');

    expect(data.storageId).toBe('unit-1');
    expect(data.codeSearchTokens).toEqual(
      expect.arrayContaining(['ta', 'tan', 'kl']),
    );
    expect(data.codeSearchTokens).toHaveLength(36);
    expect(data.ownerSearchTokens).toContain('ke');
    expect(unitDefinitionFromFirestoreData(data)).toEqual(definition);
  });

  it('normalizes query tokens and rejects searches shorter than two characters', () => {
    expect(unitDefinitionSearchToken(' Custom ')).toBe('cu');
    expect(unitDefinitionSearchToken('x')).toBeUndefined();
  });

  it('omits optional Firestore metadata when no owner or storage ID exists', () => {
    const data = unitDefinitionToFirestoreData({
      ...definition,
      ownerId: undefined,
      ownerName: undefined,
    });

    expect(data).not.toHaveProperty('storageId');
    expect(data).not.toHaveProperty('ownerSearchTokens');
  });

  it('bounds empty and one-character owner search metadata', () => {
    expect(
      unitDefinitionToFirestoreData({ ...definition, ownerName: '' })
        .ownerSearchTokens,
    ).toEqual([]);
    expect(
      unitDefinitionToFirestoreData({ ...definition, ownerName: 'x' })
        .ownerSearchTokens,
    ).toEqual(['x']);
  });
});
