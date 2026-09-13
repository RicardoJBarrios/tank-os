import { describe, expect, it } from 'vitest';
import { provideTimeAngularTestRuntime } from '../../../test-setup';

describe('provideTimeAngular', () => {
  it('Given the default Angular integration, When providers are created, Then it returns the complete temporal provider set', () => {
    expect(provideTimeAngularTestRuntime()).toHaveLength(4);
  });
});
