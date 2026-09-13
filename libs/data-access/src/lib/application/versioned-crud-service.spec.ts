import { describe, expect, it, vi } from 'vitest';
import { createEntityId, type CrudRecord } from '../core';
import { createVersionedCrudService } from './versioned-crud-service';
import type { CrudService } from './crud-service';

const instant = { kind: 'instant' as const, epochMilliseconds: 0 };
const current: CrudRecord<{ value: string }> = {
  id: createEntityId('old-unit'),
  data: { value: 'old' },
  lifecycle: { status: 'active' },
  revision: 1,
  metadata: { schemaVersion: 1, createdAt: instant, updatedAt: instant },
};

function source(
  found = true,
): Omit<
  CrudService<{ value: string }, { value: string }, { value: string }>,
  'replace'
> {
  return {
    list: vi.fn(async () => ({ items: [], hasMore: false })),
    get: vi.fn(async () => (found ? current : undefined)),
    create: vi.fn(),
    markForDeletion: vi.fn(),
    restore: vi.fn(),
    delete: vi.fn(),
  };
}

describe('createVersionedCrudService', () => {
  const request = {
    metadata: { actorId: 'keeper-1' },
    id: current.id,
    expectedRevision: 1,
  };

  it('delegates replacement to the required atomic operation', async () => {
    const replacement = { ...current, id: createEntityId('new-unit') };
    const replaceAtomically = vi.fn(async () => replacement);
    const service = createVersionedCrudService(source(), { replaceAtomically });
    await expect(service.replace(request, { value: 'new' })).resolves.toBe(
      replacement,
    );
    expect(replaceAtomically).toHaveBeenCalledWith(request, { value: 'new' });
  });

  it('validates before replacing and skips validation for a missing target', async () => {
    const validateReplace = vi.fn();
    const replaceAtomically = vi.fn(async () => current);
    const service = createVersionedCrudService(source(), {
      replaceAtomically,
      validateReplace,
    });
    await service.replace(request, { value: 'new' });
    expect(validateReplace).toHaveBeenCalledWith(current, { value: 'new' });

    const missingValidation = vi.fn();
    await createVersionedCrudService(source(false), {
      replaceAtomically,
      validateReplace: missingValidation,
    }).replace(request, { value: 'newer' });
    expect(missingValidation).not.toHaveBeenCalled();
  });
});
