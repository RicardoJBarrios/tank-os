import type { DurationPort } from '../core';
import { createZodDurationSchema } from './create-zod-duration-schema';

describe('createZodDurationSchema', () => {
  it('maps an external string through the configured duration parser', () => {
    const port = {
      parseDuration: vi
        .fn()
        .mockReturnValue({ kind: 'duration', milliseconds: 1_500 }),
    } as unknown as DurationPort;
    expect(createZodDurationSchema(port).parse('PT1.5S')).toEqual({
      kind: 'duration',
      milliseconds: 1_500,
    });
    expect(port.parseDuration).toHaveBeenCalledWith('PT1.5S');
  });

  it.each([null, undefined, 1_500])('rejects non-string input %s', (value) => {
    expect(
      createZodDurationSchema({} as DurationPort).safeParse(value).success,
    ).toBe(false);
  });

  it('maps a parser rejection to a Zod issue', () => {
    const port = {
      parseDuration: vi.fn(() => {
        throw new RangeError('Invalid duration');
      }),
    } as unknown as DurationPort;
    const result = createZodDurationSchema(port).safeParse('invalid');
    expect(result.error?.issues[0]?.message).toBe('Invalid duration');
  });
});
