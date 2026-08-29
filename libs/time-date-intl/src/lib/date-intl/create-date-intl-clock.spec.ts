import { createDateIntlClock } from './create-date-intl-clock';

describe('create-date-intl-clock', () => {
  it('composes the independently tested system-clock operation', () => {
    vi.spyOn(Date, 'now').mockReturnValue(123);
    const clock = createDateIntlClock();
    expect(clock.now()).toEqual({ kind: 'instant', epochMilliseconds: 123 });
  });
});
