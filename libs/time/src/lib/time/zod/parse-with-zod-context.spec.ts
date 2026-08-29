import { z } from 'zod';
import { parseWithZodContext } from './parse-with-zod-context';

describe('parseWithZodContext', () => {
  const context = { addIssue: vi.fn() } as unknown as z.RefinementCtx;
  beforeEach(() => vi.clearAllMocks());
  it('returns a successful parser result', () => {
    expect(parseWithZodContext(() => 42, 'number', context)).toBe(42);
  });
  it.each([
    [new RangeError('specific'), 'specific'],
    [new Error(''), 'Invalid value'],
  ] as const)('maps parser failure %s', (failure, expected) => {
    expect(
      parseWithZodContext(
        () => {
          throw failure;
        },
        'value',
        context,
      ),
    ).toBe(z.NEVER);
    expect(context.addIssue).toHaveBeenCalledWith({
      code: 'custom',
      message: expected,
    });
  });
});
