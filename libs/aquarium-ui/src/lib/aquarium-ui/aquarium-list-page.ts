import { Component, inject, type OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AquariumFeatureService } from './aquarium-feature-service';

@Component({
  selector: 'tankos-aquarium-list-page',
  imports: [RouterLink],
  templateUrl: './aquarium-list-page.html',
  styleUrl: './aquarium-list-page.css',
})
export class AquariumListPage implements OnInit {
  protected readonly service = inject(AquariumFeatureService);

  public ngOnInit(): void {
    this.service.load();
  }
}
