import { CalendarPort } from '@tankos/time';
import { toFirestoreLocalDate } from './to-firestore-local-date';

it('delegates canonical local-date serialization to the port', () => {
  const port = {
    toLocalDateString: vi.fn().mockReturnValue('2026-08-20'),
  } as unknown as CalendarPort;
  expect(toFirestoreLocalDate(port, 'input')).toBe('2026-08-20');
  expect(port.toLocalDateString).toHaveBeenCalledWith('input');
});
