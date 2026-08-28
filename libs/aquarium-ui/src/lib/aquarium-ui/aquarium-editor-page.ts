import { Component, inject, signal, type OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AquariumFeatureService } from './aquarium-feature-service';

@Component({
  selector: 'tankos-aquarium-editor-page',
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule, RouterLink],
  templateUrl: './aquarium-editor-page.html',
  styleUrl: './aquarium-editor-page.css',
})
export class AquariumEditorPage implements OnInit {
  protected readonly service = inject(AquariumFeatureService);
  readonly #route = inject(ActivatedRoute);
  readonly #router = inject(Router);
  protected name = '';
  protected dirty = false;
  protected readonly editing = this.#route.snapshot.paramMap.has('id');
  protected readonly loading = signal(this.editing);

  public ngOnInit(): void {
    const id = this.#route.snapshot.paramMap.get('id');
    if (id) {
      this.loading.set(true);
      void this.service
        .get(id)
        .then((record) => {
          this.applyLoadedName(record?.data.name ?? '');
        })
        .finally(() => {
          this.loading.set(false);
        });
    }
  }

  protected updateName(event: Event): void {
    const input = event.target;
    if (input instanceof HTMLInputElement) {
      this.dirty = true;
      this.name = input.value;
    }
  }

  protected submit(event: Event): void {
    event.preventDefault();
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    const nameControl = form.elements.namedItem('name');
    if (!(nameControl instanceof HTMLInputElement)) return;
    const name = nameControl.value.trim();
    if (!this.canSubmit(name)) return;
    const id = this.#route.snapshot.paramMap.get('id');
    void (
      id ? this.service.rename(id, name) : this.service.establish(name)
    ).then(() => this.#router.navigate(['/aquariums']));
  }

  private canSubmit(name: string): boolean {
    return Boolean(name) && !this.loading() && !this.service.saving();
  }

  private applyLoadedName(name: string): void {
    if (this.dirty) return;
    this.name = name;
  }
}
