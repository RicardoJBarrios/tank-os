import { createLuxonClock } from './create-luxon-clock';

describe('create-luxon-clock', () => {
  it('composes the independently tested system-clock operation', () => {
    vi.spyOn(Date, 'now').mockReturnValue(123);
    const clock = createLuxonClock();
    expect(clock.now()).toEqual({ kind: 'instant', epochMilliseconds: 123 });
  });
});
