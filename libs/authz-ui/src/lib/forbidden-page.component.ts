import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'tankos-forbidden-page',
  imports: [MatButtonModule, MatCardModule, RouterLink],
  templateUrl: './forbidden-page.component.html',
  styleUrl: './forbidden-page.component.css',
})
export class ForbiddenPageComponent {
  protected readonly page = true;
}
