import { describe, expect, it, vi } from 'vitest';

const repository = {
  list: vi.fn(),
  get: vi.fn(),
  create: vi.fn(),
  replace: vi.fn(),
  replaceVersioned: vi.fn(),
  markForDeletion: vi.fn(),
  restore: vi.fn(),
  delete: vi.fn(),
};

vi.mock('@tankos/data-access-firestore', () => ({
  createFirestoreCrudRepository: vi.fn(() => repository),
  createFirestoreRecordSchema: vi.fn(() => ({ parse: vi.fn() })),
}));

import { createAquariumFirestoreRepository } from './aquarium-firestore-repository';

describe('createAquariumFirestoreRepository', () => {
  it('composes the shared Firestore CRUD adapter for aquariums', async () => {
    const { createFirestoreCrudRepository } =
      await import('@tankos/data-access-firestore');

    createAquariumFirestoreRepository({
      firestore: {} as never,
      clock: { now: () => new Date() },
    });

    expect(createFirestoreCrudRepository).toHaveBeenCalledWith(
      expect.objectContaining({ collectionPath: 'aquariums' }),
    );
  });
});
