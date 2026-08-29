import type { InstantPort } from '../core';
import { createZodInstantSchema } from './create-zod-instant-schema';

describe('createZodInstantSchema', () => {
  it('maps an external string through the configured instant parser', () => {
    const port = {
      parseInstant: vi
        .fn()
        .mockReturnValue({ kind: 'instant', epochMilliseconds: 123 }),
    } as unknown as InstantPort;
    expect(createZodInstantSchema(port).parse('external')).toEqual({
      kind: 'instant',
      epochMilliseconds: 123,
    });
    expect(port.parseInstant).toHaveBeenCalledWith('external');
  });

  it.each([null, undefined, 0])('rejects non-string input %s', (value) => {
    const port = {} as InstantPort;
    expect(createZodInstantSchema(port).safeParse(value).success).toBe(false);
  });

  it('maps a parser rejection to a Zod issue', () => {
    const port = {
      parseInstant: vi.fn(() => {
        throw new RangeError('Invalid instant');
      }),
    } as unknown as InstantPort;
    const result = createZodInstantSchema(port).safeParse('invalid');
    expect(result.error?.issues[0]?.message).toBe('Invalid instant');
  });
});
