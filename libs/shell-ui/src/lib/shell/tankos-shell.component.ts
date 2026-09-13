import { Component, DestroyRef, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AUTH_SESSION } from '@tankos/authn-angular';
import type { AuthenticatedPrincipal } from '@tankos/authn';
import { authorizationSubjectFromPrincipal } from '@tankos/authz';
import { FeedbackMaterialOutletComponent } from '@tankos/feedback-ui';

@Component({
  selector: 'tankos-shell',
  imports: [
    RouterLink,
    RouterOutlet,
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    FeedbackMaterialOutletComponent,
  ],
  templateUrl: './tankos-shell.component.html',
  styleUrl: './tankos-shell.component.css',
})
export class TankosShellComponent {
  readonly #authSession = inject(AUTH_SESSION, { optional: true });
  readonly #router = inject(Router);
  readonly #destroyRef = inject(DestroyRef);

  protected readonly title = 'TankOS';
  protected readonly loggingOut = signal(false);
  protected readonly loadingAccount = signal(false);
  protected readonly account = signal<AuthenticatedPrincipal | null>(null);
  protected readonly roles = signal<readonly string[]>([]);
  protected readonly accountResolved = signal(false);

  public constructor() {
    const subscribe = this.#authSession?.subscribe;
    if (subscribe) {
      const unsubscribe = subscribe(() => {
        this.refreshAccount();
      });
      this.#destroyRef.onDestroy(unsubscribe);
    }
  }

  protected accountLabel(): string {
    return this.account()?.displayName ?? 'Account';
  }

  protected accountInitial(): string {
    return this.accountLabel().slice(0, 1).toUpperCase();
  }

  protected refreshAccount(): void {
    const session = this.#authSession;
    if (!session) {
      this.accountResolved.set(true);
      return;
    }

    this.loadingAccount.set(true);
    void session
      .principal()
      .then((principal) => {
        this.account.set(principal);
        this.roles.set(authorizationSubjectFromPrincipal(principal).roles);
      })
      .catch(() => {
        this.account.set(null);
        this.roles.set([]);
      })
      .finally(() => {
        this.accountResolved.set(true);
        this.loadingAccount.set(false);
      });
  }

  protected async logout(): Promise<void> {
    if (!this.#authSession) return;
    this.loggingOut.set(true);
    try {
      await this.#authSession.signOut();
      this.account.set(null);
      this.roles.set([]);
      this.accountResolved.set(true);
      await this.#router.navigate(['/login']);
    } finally {
      this.loggingOut.set(false);
    }
  }
}
