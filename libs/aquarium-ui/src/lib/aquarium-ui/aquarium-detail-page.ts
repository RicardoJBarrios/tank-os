import { Component, inject, signal, type OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AUTH_SESSION } from '@tankos/authn-angular';
import { authorizationSubjectFromPrincipal } from '@tankos/authz';
import { CONFIRMATION_SERVICE, confirmAndRun } from '@tankos/feedback';
import type { AquariumListItem } from '@tankos/aquarium';
import {
  TankosPageHeaderComponent,
  TankosStateCardComponent,
} from '@tankos/ui-material';
import { AquariumFeatureService } from './aquarium-feature-service';
import { ACCESSIBLE_AQUARIUM_READER } from './aquarium-tokens';

@Component({
  selector: 'tankos-aquarium-detail-page',
  imports: [
    MatButtonModule,
    RouterLink,
    TankosPageHeaderComponent,
    TankosStateCardComponent,
  ],
  templateUrl: './aquarium-detail-page.html',
  styleUrl: './aquarium-detail-page.css',
})
export class AquariumDetailPage implements OnInit {
  protected readonly aquarium = signal<AquariumListItem | null>(null);
  protected readonly loading = signal(true);
  readonly #route = inject(ActivatedRoute);
  readonly #reader = inject(ACCESSIBLE_AQUARIUM_READER);
  readonly #auth = inject(AUTH_SESSION);
  protected readonly service = inject(AquariumFeatureService);
  readonly #confirmation = inject(CONFIRMATION_SERVICE);

  public ngOnInit(): void {
    const id = this.#route.snapshot.paramMap.get('id');
    if (!id) {
      this.loading.set(false);
      return;
    }
    void this.#auth
      .principal()
      .then(authorizationSubjectFromPrincipal)
      .then((subject) => this.#reader.getAccessible(subject, id as never))
      .then((aquarium) => {
        this.aquarium.set(aquarium);
        this.loading.set(false);
      });
  }

  protected async deleteAquarium(): Promise<void> {
    const current = this.aquarium();
    if (!current) return;
    await confirmAndRun(
      this.#confirmation,
      {
        title: 'Delete aquarium',
        message: 'The aquarium will be moved to the recycle bin.',
        confirmLabel: 'Delete aquarium',
      },
      () => this.service.markForDeletion(current.id),
    );
  }

  protected async restoreAquarium(): Promise<void> {
    const current = this.aquarium();
    if (current) await this.service.restore(current.id);
  }

  protected async deletePermanently(): Promise<void> {
    const current = this.aquarium();
    if (!current) return;
    await confirmAndRun(
      this.#confirmation,
      {
        title: 'Delete aquarium permanently',
        message:
          'This cannot be undone and will permanently remove the aquarium.',
        confirmLabel: 'Delete permanently',
      },
      () => this.service.deletePermanently(current.id),
    );
  }
}
