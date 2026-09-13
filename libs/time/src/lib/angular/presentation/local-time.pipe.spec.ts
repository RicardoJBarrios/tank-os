import { createServiceFactory } from '@ngneat/spectator/vitest';
import { LocalTimePipe } from './local-time.pipe';
import { parseLocalTime } from '@tankos/time';

describe('civil clock pipe', () => {
  const create = createServiceFactory(LocalTimePipe);
  it('uses Angular locale and preserves precision with no zone shift', () => {
    const pipe = create().service;
    expect(pipe.transform('13:30')).toContain('1:30:00');
    expect(
      pipe.transform(parseLocalTime('23:59:59.123'), 'HH:mm:ss.SSS', 'en-US'),
    ).toBe('23:59:59.123');
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
    expect(() => pipe.transform('24:00')).toThrow(RangeError);
  });
});
