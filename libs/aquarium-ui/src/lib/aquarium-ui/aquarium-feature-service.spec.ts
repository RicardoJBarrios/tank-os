import { describe, expect, it, vi } from 'vitest';
import type { AuthSessionPort } from '@tankos/authn';
import type {
  AquariumEstablisher,
  AccessibleAquariumReader,
  AquariumManager,
} from '@tankos/aquarium';
import type { FeedbackService } from '@tankos/feedback';
import { AquariumFeatureService } from './aquarium-feature-service';

function createService() {
  const reader: AccessibleAquariumReader = {
    listAccessible: vi.fn().mockResolvedValue([]),
    getAccessible: vi.fn(),
  };
  const establisher: AquariumEstablisher = {
    establish: vi.fn().mockResolvedValue(undefined),
  };
  const manager: AquariumManager = {
    get: vi.fn(),
    rename: vi.fn().mockResolvedValue(undefined),
    markForDeletion: vi.fn().mockResolvedValue(undefined),
    restore: vi.fn().mockResolvedValue(undefined),
    deletePermanently: vi.fn().mockResolvedValue(undefined),
  };
  const auth = {
    principal: vi
      .fn()
      .mockResolvedValue({ id: 'keeper-1', claims: { roles: ['keeper'] } }),
  } as unknown as AuthSessionPort;
  const feedback = {
    error: vi.fn(),
    success: vi.fn(),
  } as unknown as FeedbackService;
  return {
    service: new AquariumFeatureService(
      reader,
      establisher,
      manager,
      auth,
      feedback,
    ),
    reader,
    establisher,
    feedback,
  };
}

describe('AquariumFeatureService', () => {
  it('loads accessible aquariums through the application port', async () => {
    const { service, reader } = createService();
    void service.load();
    await vi.waitFor(() => {
      expect(reader.listAccessible).toHaveBeenCalledWith({
        id: 'keeper-1',
        roles: ['keeper'],
        attributes: { roles: ['keeper'] },
      });
    });
    expect(service.status()).toBe('ready');
  });

  it('establishes an aquarium and reports success', async () => {
    const { service, establisher, feedback } = createService();
    await service.establish('  Reef  ');
    expect(establisher.establish).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'keeper-1', roles: ['keeper'] }),
      { name: 'Reef', keeperId: 'keeper-1' },
    );
    expect(feedback.success).toHaveBeenCalled();
  });
});
