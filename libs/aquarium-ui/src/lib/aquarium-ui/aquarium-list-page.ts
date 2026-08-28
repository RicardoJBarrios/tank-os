import { Component, inject, type OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { CONFIRMATION_SERVICE, confirmAndRun } from '@tankos/feedback';
import {
  TankosPageHeaderComponent,
  TankosStateCardComponent,
} from '@tankos/ui-material';
import { AquariumFeatureService } from './aquarium-feature-service';

@Component({
  selector: 'tankos-aquarium-list-page',
  imports: [
    MatButtonModule,
    RouterLink,
    TankosPageHeaderComponent,
    TankosStateCardComponent,
  ],
  templateUrl: './aquarium-list-page.html',
  styleUrl: './aquarium-list-page.css',
})
export class AquariumListPage implements OnInit {
  protected readonly service = inject(AquariumFeatureService);
  readonly #confirmation = inject(CONFIRMATION_SERVICE);

  public ngOnInit(): void {
    if (this.service.status() === 'idle') void this.service.load();
  }

  protected async deleteAquarium(id: string): Promise<void> {
    await confirmAndRun(
      this.#confirmation,
      {
        title: 'Delete aquarium',
        message: 'The aquarium will be moved to the recycle bin.',
        confirmLabel: 'Delete aquarium',
      },
      () => this.service.markForDeletion(id),
    );
  }

  protected async restoreAquarium(id: string): Promise<void> {
    await this.service.restore(id);
  }

  protected async deletePermanently(id: string): Promise<void> {
    await confirmAndRun(
      this.#confirmation,
      {
        title: 'Delete aquarium permanently',
        message:
          'This cannot be undone and will permanently remove the aquarium.',
        confirmLabel: 'Delete permanently',
      },
      () => this.service.deletePermanently(id),
    );
  }
}
