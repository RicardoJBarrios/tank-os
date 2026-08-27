import { signal } from '@angular/core';
import type { AuthSessionPort } from '@tankos/authn';
import type {
  AccessibleAquariumReader,
  AquariumEstablisher,
  AquariumListItem,
} from '@tankos/aquarium';
import type { FeedbackService } from '@tankos/feedback';
import type { AquariumName } from '@tankos/aquarium';

export class AquariumFeatureService {
  public readonly items = signal<readonly AquariumListItem[]>([]);
  public readonly status = signal<'idle' | 'loading' | 'ready' | 'error'>(
    'idle',
  );
  public readonly error = signal<unknown>(undefined);
  public readonly saving = signal(false);

  public constructor(
    private readonly reader: AccessibleAquariumReader,
    private readonly establisher: AquariumEstablisher,
    private readonly auth: AuthSessionPort,
    private readonly feedback: FeedbackService,
  ) {}

  public load(): void {
    this.status.set('loading');
    this.error.set(undefined);
    void this.auth
      .access()
      .then((access) => this.reader.listAccessible(access.principalId))
      .then((items) => {
        this.items.set(items);
        this.status.set('ready');
      })
      .catch((error: unknown) => {
        this.error.set(error);
        this.status.set('error');
        this.feedback.error('Unable to load aquariums.');
      });
  }

  public establish(name: string): Promise<void> {
    this.saving.set(true);
    return this.auth
      .access()
      .then((access) =>
        this.establisher.establish({
          name: name.trim() as AquariumName,
          keeperId: access.principalId,
        }),
      )
      .then(() => {
        this.feedback.success('Aquarium created.');
        this.load();
      })
      .catch((error: unknown) => {
        this.error.set(error);
        this.feedback.error('Unable to create the aquarium.');
        throw error;
      })
      .finally(() => {
        this.saving.set(false);
      });
  }
}
