import { Timestamp } from 'firebase/firestore';
import {
  firestoreDurationSchema,
  firestoreLocalDateSchema,
  firestoreTimestampSchema,
} from './firestore-schemas';

describe('Firestore temporal representation schemas', () => {
  it('accepts the three canonical physical representations', () => {
    expect(firestoreTimestampSchema.safeParse(Timestamp.fromMillis(0)).success).toBe(
      true,
    );
    expect(firestoreLocalDateSchema.safeParse('2026-08-20').success).toBe(true);
    expect(firestoreDurationSchema.safeParse(-1_500).success).toBe(true);
  });

  it.each([
    [firestoreTimestampSchema, new Date(0)],
    [firestoreLocalDateSchema, 20_260_820],
    [firestoreDurationSchema, 1.5],
    [firestoreDurationSchema, Number.POSITIVE_INFINITY],
    [firestoreDurationSchema, Number.MAX_SAFE_INTEGER + 1],
  ] as const)('rejects a non-canonical physical value', (schema, value) => {
    expect(schema.safeParse(value).success).toBe(false);
  });
});
