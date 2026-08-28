import { Component, inject, type OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
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

  public ngOnInit(): void {
    this.service.load();
  }
}
