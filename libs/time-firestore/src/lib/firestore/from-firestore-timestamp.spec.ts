import { Timestamp } from 'firebase/firestore';
import { InstantPort } from '@tankos/time';
import { fromFirestoreTimestamp } from './from-firestore-timestamp';

describe('fromFirestoreTimestamp', () => {
  const port = {
    parseInstant: vi.fn((value) => ({
      kind: 'instant',
      epochMilliseconds: value,
    })),
  } as unknown as InstantPort;

  it('truncates sub-millisecond precision before delegating', () => {
    expect(fromFirestoreTimestamp(port, new Timestamp(10, 999_999))).toEqual({
      kind: 'instant',
      epochMilliseconds: 10_000,
    });
  });

  it.each([null, undefined, {}, new Date(0)])(
    'rejects a non-Timestamp value: %s',
    (value) => {
      expect(() => fromFirestoreTimestamp(port, value)).toThrow(RangeError);
    },
  );
});
