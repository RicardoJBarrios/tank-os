import {
  createFirestoreCrudRepository,
  createFirestoreRecordSchema,
  type FirestoreCrudRepositoryOptions,
} from '@tankos/data-access-firestore';
import type { VersionedCrudRepositoryPort } from '@tankos/data-access';
import { type UnitDefinition, type UnitDefinitionFilter } from '@tankos/units';
import { createMappedFirestoreCrudRepository } from './mapped-firestore-crud-repository';
import {
  type UnitDefinitionFirestoreData,
  unitDefinitionFirestoreDataSchema,
  unitDefinitionFromFirestoreData,
  unitDefinitionToFirestoreData,
} from './unit-definition-firestore-data';

/** Firestore repository options for the public and private unit catalogue. */
export type UnitDefinitionFirestoreRepositoryOptions = Omit<
  FirestoreCrudRepositoryOptions<
    UnitDefinitionFirestoreData,
    UnitDefinition,
    UnitDefinition,
    UnitDefinitionFilter
  >,
  'recordSchema' | 'createData' | 'updateData'
>;

/** Creates the unit CRUD port implementation backed by Firestore. */
export function createUnitDefinitionFirestoreRepository(
  options: UnitDefinitionFirestoreRepositoryOptions,
): VersionedCrudRepositoryPort<
  UnitDefinition,
  UnitDefinition,
  UnitDefinition,
  UnitDefinitionFilter
> {
  const repository = createFirestoreCrudRepository<
    UnitDefinitionFirestoreData,
    UnitDefinition,
    UnitDefinition,
    UnitDefinitionFilter
  >({
    ...options,
    recordSchema: unitDefinitionRecordSchema,
    createData: (input, id) => unitDefinitionToFirestoreData(input, id),
    updateData: (_data, input, id) => unitDefinitionToFirestoreData(input, id),
  });

  return createMappedFirestoreCrudRepository(
    repository,
    unitDefinitionFromFirestoreData,
  );
}

/** Strict Firestore envelope schema for unit-definition records. */
export const unitDefinitionRecordSchema = createFirestoreRecordSchema(
  unitDefinitionFirestoreDataSchema,
);
