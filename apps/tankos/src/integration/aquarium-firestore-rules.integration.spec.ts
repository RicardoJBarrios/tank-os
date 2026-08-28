import {
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

let rulesEnvironment: RulesTestEnvironment | undefined;

describe('aquariums Firestore Rules', () => {
  beforeAll(async () => {
    if (!process.env['FIRESTORE_EMULATOR_HOST'])
      throw new Error(
        'FIRESTORE_EMULATOR_HOST is required for Aquarium Rules tests',
      );
    rulesEnvironment = await initializeTestEnvironment({
      projectId: 'demo-tankos',
      firestore: {
        rules: readFileSync(
          resolve(__dirname, '../../../../firestore.rules'),
          'utf8',
        ),
      },
    });
  });

  beforeEach(async () => rulesEnvironment?.clearFirestore());
  afterAll(async () => rulesEnvironment?.cleanup());

  it('permite al admin crear y leer un acuario', async () => {
    const admin = rulesEnvironment
      ?.authenticatedContext('admin-aquarium', { roles: ['admin'] })
      .firestore();
    if (!admin) throw new Error('Firestore Rules environment is unavailable');

    const reference = doc(admin, 'aquariums', 'aquarium-admin');
    await expect(
      setDoc(reference, aquariumRecord('admin-aquarium', 'aquarium-admin')),
    ).resolves.toBeUndefined();
    await expect(getDoc(reference)).resolves.toBeDefined();
  });

  it('permite al keeper acceder a su acuario y deniega el de otro keeper', async () => {
    const owner = rulesEnvironment
      ?.authenticatedContext('keeper-aquarium-1', { roles: ['keeper'] })
      .firestore();
    const other = rulesEnvironment
      ?.authenticatedContext('keeper-aquarium-2', { roles: ['keeper'] })
      .firestore();
    if (!owner || !other)
      throw new Error('Firestore Rules environment is unavailable');

    const reference = doc(owner, 'aquariums', 'aquarium-owner');
    await setDoc(
      reference,
      aquariumRecord('keeper-aquarium-1', 'aquarium-owner'),
    );
    await expect(getDoc(reference)).resolves.toBeDefined();
    await expect(
      getDoc(doc(other, 'aquariums', 'aquarium-owner')),
    ).rejects.toThrow();
  });

  it('deniega al keeper la creación para otro principal', async () => {
    const keeper = rulesEnvironment
      ?.authenticatedContext('keeper-aquarium-3', { roles: ['keeper'] })
      .firestore();
    if (!keeper) throw new Error('Firestore Rules environment is unavailable');

    await expect(
      setDoc(
        doc(keeper, 'aquariums', 'aquarium-for-other'),
        aquariumRecord('keeper-aquarium-4', 'aquarium-for-other'),
      ),
    ).rejects.toThrow();
  });

  it('no permite el borrado físico de un acuario activo', async () => {
    const admin = rulesEnvironment
      ?.authenticatedContext('admin-aquarium-delete', { roles: ['admin'] })
      .firestore();
    if (!admin) throw new Error('Firestore Rules environment is unavailable');

    const reference = doc(admin, 'aquariums', 'aquarium-active');
    await setDoc(
      reference,
      aquariumRecord('keeper-aquarium-5', 'aquarium-active'),
    );
    const { deleteDoc } = await import('firebase/firestore');
    await expect(deleteDoc(reference)).rejects.toThrow();
  });
});

function aquariumRecord(establishedByKeeperId: string, storageId: string) {
  const now = Timestamp.now();
  return {
    data: {
      storageId,
      name: 'Home Aquarium',
      establishedByKeeperId,
      establishedAt: new Date().toISOString(),
      components: [],
      links: [],
      nameSearchTokens: ['ho', 'hom', 'home'],
    },
    lifecycle: { status: 'active' },
    revision: 1,
    metadata: {
      schemaVersion: 1,
      createdAt: now,
      updatedAt: now,
    },
  };
}
