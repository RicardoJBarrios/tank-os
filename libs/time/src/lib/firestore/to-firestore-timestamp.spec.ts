import { Timestamp } from 'firebase/firestore';
import { InstantPort } from '@tankos/time';
import { toFirestoreTimestamp } from './to-firestore-timestamp';

it('converts the instant normalized by the port to a Firestore timestamp', () => {
  const port = {
    parseInstant: vi
      .fn()
      .mockReturnValue({ kind: 'instant', epochMilliseconds: 1_234 }),
  } as unknown as InstantPort;
  expect(toFirestoreTimestamp(port, 'input')).toEqual(
    Timestamp.fromMillis(1_234),
  );
  expect(port.parseInstant).toHaveBeenCalledWith('input');
});
