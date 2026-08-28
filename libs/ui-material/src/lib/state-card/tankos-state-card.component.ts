import { Component, input } from '@angular/core';
import type { TankosPageState } from '@tankos/ui';

@Component({
  selector: 'tankos-state-card',
  templateUrl: './tankos-state-card.component.html',
  styleUrl: './tankos-state-card.component.css',
})
export class TankosStateCardComponent {
  public readonly state = input.required<TankosPageState>();
  public readonly title = input.required<string>();
  public readonly message = input('');
}
