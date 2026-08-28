import { Component, inject, signal, type OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AUTH_SESSION } from '@tankos/authn';
import type { AquariumListItem } from '@tankos/aquarium';
import {
  TankosPageHeaderComponent,
  TankosStateCardComponent,
} from '@tankos/ui-material';
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

  public ngOnInit(): void {
    const id = this.#route.snapshot.paramMap.get('id');
    if (!id) {
      this.loading.set(false);
      return;
    }
    void this.#auth
      .access()
      .then((access) =>
        this.#reader.getAccessible(access.principalId, id as never),
      )
      .then((aquarium) => {
        this.aquarium.set(aquarium);
        this.loading.set(false);
      });
  }
}
