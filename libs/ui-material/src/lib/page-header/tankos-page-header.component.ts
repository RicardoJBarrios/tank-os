import { Component, input } from '@angular/core';

@Component({
  selector: 'tankos-page-header',
  templateUrl: './tankos-page-header.component.html',
  styleUrl: './tankos-page-header.component.css',
})
export class TankosPageHeaderComponent {
  public readonly eyebrow = input('');
  public readonly title = input.required<string>();
  public readonly description = input('');
}
