import { describe, expect, it } from 'vitest';
import { createMutationMetadata } from './mutation-metadata';

describe('createMutationMetadata', () => {
  it('snapshots valid technical metadata', () => {
    const value = { actorId: 'keeper-1', requestId: 'request-1' };
    expect(createMutationMetadata(value)).toEqual(value);
    expect(createMutationMetadata(value)).not.toBe(value);
  });

  it('rejects empty actors and request ids', () => {
    expect(() => createMutationMetadata({ actorId: ' ' })).toThrow(TypeError);
    expect(() =>
      createMutationMetadata({ actorId: 'keeper-1', requestId: ' ' }),
    ).toThrow(TypeError);
  });
});
