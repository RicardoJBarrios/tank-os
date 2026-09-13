import { TimePort } from '@tankos/time';
import { formatAngularDuration } from './format-angular-duration';

describe('formatAngularDuration', () => {
  const port = {
    parseDuration: vi.fn((value) => ({
      kind: 'duration',
      milliseconds: value,
    })),
    toDurationIsoString: vi.fn().mockReturnValue('PT1H'),
  } as unknown as TimePort;
  it.each([
    ['digital', -5_400_000, '-01:30:00'],
    ['short', 0, '0 ms'],
    ['long', 5_400_000, '1 hour, 30 minutes'],
  ] as const)('supports %s style', (style, value, expected) => {
    expect(formatAngularDuration(port, 'en-US', value, { style })).toBe(
      expected,
    );
  });
  it('delegates ISO serialization to the temporal port', () => {
    expect(
      formatAngularDuration(port, 'en-US', 3_600_000, { style: 'iso' }),
    ).toBe('PT1H');
  });
  it('honors a locale override', () => {
    expect(
      formatAngularDuration(port, 'en-US', 3_600_000, {
        style: 'long',
        locale: 'es-ES',
      }),
    ).toBe('1 hora');
  });
});
