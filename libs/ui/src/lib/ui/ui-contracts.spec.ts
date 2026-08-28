import { describe, expect, it } from 'vitest';
import { TANKOS_UI_LAYOUT } from './ui-contracts';

describe('@tankos/ui contracts', () => {
  it('exposes the shared layout constraints without a framework dependency', () => {
    expect(TANKOS_UI_LAYOUT).toMatchObject({
      contentMaxWidth: '72rem',
      formMaxWidth: '52rem',
    });
    expect(Object.isFrozen(TANKOS_UI_LAYOUT)).toBe(true);
  });
});
