import { Component, inject, signal, type OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { AUTH_SESSION } from '@tankos/authn-angular';
import type { AuthenticatedPrincipal } from '@tankos/authn';
import { authorizationSubjectFromPrincipal } from '@tankos/authz';

@Component({
  selector: 'tankos-profile-page',
  imports: [MatButtonModule, MatCardModule, RouterLink],
  templateUrl: './tankos-profile-page.component.html',
  styleUrl: './tankos-profile-page.component.css',
})
export class TankosProfilePageComponent implements OnInit {
  readonly #session = inject(AUTH_SESSION);
  protected readonly account = signal<AuthenticatedPrincipal | null>(null);
  protected readonly roles = signal<readonly string[]>([]);

  public ngOnInit(): void {
    void this.#loadAccount();
  }

  async #loadAccount(): Promise<void> {
    const principal = await this.#session.principal();
    this.account.set(principal);
    this.roles.set(authorizationSubjectFromPrincipal(principal).roles);
  }
}
