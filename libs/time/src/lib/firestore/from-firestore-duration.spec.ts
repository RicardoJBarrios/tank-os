import { DurationPort } from '@tankos/time';
import { fromFirestoreDuration } from './from-firestore-duration';

describe('fromFirestoreDuration', () => {
  const port = {
    parseDuration: vi.fn((milliseconds) => ({
      kind: 'duration',
      milliseconds,
    })),
  } as unknown as DurationPort;

  it('delegates validated integer milliseconds to the temporal port', () => {
    expect(fromFirestoreDuration(port, -1)).toEqual({
      kind: 'duration',
      milliseconds: -1,
    });
    expect(port.parseDuration).toHaveBeenCalledWith(-1);
  });

  it.each([
    null,
    undefined,
    NaN,
    '3600000',
    Infinity,
    -Infinity,
    -1.9,
    Number.MAX_SAFE_INTEGER + 1,
  ])('rejects an invalid duration value: %s', (value) => {
    expect(() => fromFirestoreDuration(port, value)).toThrow(RangeError);
  });
});
