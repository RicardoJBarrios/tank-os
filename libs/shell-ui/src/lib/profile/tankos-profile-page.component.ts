import { Component, inject, signal, type OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { AUTH_SESSION } from '@tankos/authn';
import type { AccessContext } from '@tankos/data-access';

@Component({
  selector: 'tankos-profile-page',
  imports: [MatButtonModule, MatCardModule, RouterLink],
  templateUrl: './tankos-profile-page.component.html',
  styleUrl: './tankos-profile-page.component.css',
})
export class TankosProfilePageComponent implements OnInit {
  readonly #session = inject(AUTH_SESSION);
  protected readonly account = signal<AccessContext | null>(null);

  public ngOnInit(): void {
    void this.#loadAccount();
  }

  async #loadAccount(): Promise<void> {
    this.account.set(await this.#session.access());
  }
}
