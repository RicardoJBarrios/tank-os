import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AquariumFeatureService } from './aquarium-feature-service';

@Component({
  selector: 'tankos-aquarium-editor-page',
  imports: [FormsModule, RouterLink],
  templateUrl: './aquarium-editor-page.html',
  styleUrl: './aquarium-editor-page.css',
})
export class AquariumEditorPage {
  protected readonly service = inject(AquariumFeatureService);
  readonly #router = inject(Router);
  protected name = '';

  protected submit(): void {
    if (!this.name.trim() || this.service.saving()) return;
    void this.service
      .establish(this.name)
      .then(() => this.#router.navigate(['/aquariums']));
  }
}
