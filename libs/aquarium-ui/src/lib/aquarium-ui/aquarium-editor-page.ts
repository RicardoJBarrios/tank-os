import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { AquariumFeatureService } from './aquarium-feature-service';

@Component({
  selector: 'tankos-aquarium-editor-page',
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule, RouterLink],
  templateUrl: './aquarium-editor-page.html',
  styleUrl: './aquarium-editor-page.css',
})
export class AquariumEditorPage {
  protected readonly service = inject(AquariumFeatureService);
  readonly #router = inject(Router);
  protected name = '';

  protected submit(event: Event): void {
    event.preventDefault();
    if (!this.name.trim() || this.service.saving()) return;
    void this.service
      .establish(this.name)
      .then(() => this.#router.navigate(['/aquariums']));
  }
}
