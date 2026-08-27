import { describe, expect, it, vi } from 'vitest';
import type { AuthSessionPort } from '@tankos/authn';
import type {
  AquariumEstablisher,
  AccessibleAquariumReader,
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
  const auth = {
    access: vi
      .fn()
      .mockResolvedValue({ principalId: 'keeper-1', roles: ['keeper'] }),
  } as unknown as AuthSessionPort;
  const feedback = {
    error: vi.fn(),
    success: vi.fn(),
  } as unknown as FeedbackService;
  return {
    service: new AquariumFeatureService(reader, establisher, auth, feedback),
    reader,
    establisher,
    feedback,
  };
}

describe('AquariumFeatureService', () => {
  it('loads accessible aquariums through the application port', async () => {
    const { service, reader } = createService();
    service.load();
    await vi.waitFor(() => {
      expect(reader.listAccessible).toHaveBeenCalledWith('keeper-1');
    });
    expect(service.status()).toBe('ready');
  });

  it('establishes an aquarium and reports success', async () => {
    const { service, establisher, feedback } = createService();
    await service.establish('  Reef  ');
    expect(establisher.establish).toHaveBeenCalledWith({
      name: 'Reef',
      keeperId: 'keeper-1',
    });
    expect(feedback.success).toHaveBeenCalled();
  });
});
