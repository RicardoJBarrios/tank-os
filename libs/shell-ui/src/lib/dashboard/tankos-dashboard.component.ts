import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'tankos-dashboard',
  imports: [MatButtonModule, MatCardModule, RouterLink],
  templateUrl: './tankos-dashboard.component.html',
  styleUrl: './tankos-dashboard.component.css',
})
export class TankosDashboardComponent {
  protected readonly greeting = 'Good morning';
}
