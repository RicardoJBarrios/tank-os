import { Timestamp } from 'firebase/firestore';
import { isFirestoreTimestamp } from './is-firestore-timestamp';

it('accepts only Firestore Timestamp instances', () => {
  expect(isFirestoreTimestamp(Timestamp.fromMillis(0))).toBe(true);
  expect(isFirestoreTimestamp(new Date(0))).toBe(false);
  expect(isFirestoreTimestamp(null)).toBe(false);
});
