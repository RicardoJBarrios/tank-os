import { signal } from '@angular/core';
import { computed } from '@angular/core';
import type { AuthSessionPort } from '@tankos/authn';
import {
  authorizationSubjectFromPrincipal,
  type AuthorizationSubject,
} from '@tankos/authz';
import type {
  AccessibleAquariumReader,
  AquariumManager,
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
  public readonly subject = signal<AuthorizationSubject | undefined>(undefined);
  public readonly admin = computed(
    () => this.subject()?.roles.includes('admin') ?? false,
  );

  public constructor(
    private readonly reader: AccessibleAquariumReader,
    private readonly establisher: AquariumEstablisher,
    private readonly manager: AquariumManager,
    private readonly auth: AuthSessionPort,
    private readonly feedback: FeedbackService,
  ) {}

  public load(): Promise<void> {
    this.status.set('loading');
    this.error.set(undefined);
    return this.auth
      .principal()
      .then(authorizationSubjectFromPrincipal)
      .then((subject) => {
        this.subject.set(subject);
        return this.reader.listAccessible(subject);
      })
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
      .principal()
      .then(authorizationSubjectFromPrincipal)
      .then((subject) =>
        this.establisher.establish(subject, {
          name: name.trim() as AquariumName,
          keeperId: subject.id,
        }),
      )
      .then(() => {
        this.feedback.success('Aquarium created.');
        return this.load();
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

  public rename(id: string, name: string): Promise<void> {
    return this.command(
      (subject) =>
        this.manager.rename(subject, id as never, name.trim() as never),
      'Aquarium updated.',
    );
  }

  public markForDeletion(id: string): Promise<void> {
    return this.command(
      (subject) => this.manager.markForDeletion(subject, id as never),
      'Aquarium moved to the recycle bin.',
    );
  }

  public restore(id: string): Promise<void> {
    return this.command(
      (subject) => this.manager.restore(subject, id as never),
      'Aquarium restored.',
    );
  }

  public deletePermanently(id: string): Promise<void> {
    return this.command(
      (subject) => this.manager.deletePermanently(subject, id as never),
      'Aquarium permanently deleted.',
    );
  }

  public get(id: string) {
    return this.auth
      .principal()
      .then(authorizationSubjectFromPrincipal)
      .then((subject) => {
        this.subject.set(subject);
        return this.manager.get(subject, id as never);
      });
  }

  private command(
    action: (subject: AuthorizationSubject) => Promise<void>,
    successMessage: string,
  ): Promise<void> {
    this.saving.set(true);
    return this.auth
      .principal()
      .then(authorizationSubjectFromPrincipal)
      .then(action)
      .then(() => {
        this.feedback.success(successMessage);
        return this.load();
      })
      .then(() => undefined)
      .catch((error: unknown) => {
        this.error.set(error);
        this.feedback.error('Unable to update the aquarium.');
        throw error;
      })
      .finally(() => {
        this.saving.set(false);
      });
  }
}
