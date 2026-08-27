import { Component, inject, type OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AUTH_SESSION } from '@tankos/authn';
import type { AquariumListItem } from '@tankos/aquarium';
import { ACCESSIBLE_AQUARIUM_READER } from './aquarium-tokens';

@Component({
  selector: 'tankos-aquarium-detail-page',
  imports: [RouterLink],
  templateUrl: './aquarium-detail-page.html',
  styleUrl: './aquarium-detail-page.css',
})
export class AquariumDetailPage implements OnInit {
  protected aquarium: AquariumListItem | null = null;
  protected loading = true;
  readonly #route = inject(ActivatedRoute);
  readonly #reader = inject(ACCESSIBLE_AQUARIUM_READER);
  readonly #auth = inject(AUTH_SESSION);

  public ngOnInit(): void {
    const id = this.#route.snapshot.paramMap.get('id');
    if (!id) {
      this.loading = false;
      return;
    }
    void this.#auth
      .access()
      .then((access) =>
        this.#reader.getAccessible(access.principalId, id as never),
      )
      .then((aquarium) => {
        this.aquarium = aquarium;
        this.loading = false;
      });
  }
}
