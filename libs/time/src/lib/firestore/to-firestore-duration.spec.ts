import { DurationPort } from '@tankos/time';
import { toFirestoreDuration } from './to-firestore-duration';

it('delegates duration normalization to the port', () => {
  const port = {
    parseDuration: vi
      .fn()
      .mockReturnValue({ kind: 'duration', milliseconds: -1_500 }),
  } as unknown as DurationPort;
  expect(toFirestoreDuration(port, 'input')).toBe(-1_500);
  expect(port.parseDuration).toHaveBeenCalledWith('input');
});
