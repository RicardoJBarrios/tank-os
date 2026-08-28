import { Component } from '@angular/core';
import { TankosShellComponent } from '@tankos/shell-ui';

@Component({
  imports: [TankosShellComponent],
  selector: 'tankos-root',
  templateUrl: './app.html',
})
export class App {
  protected readonly compositionRoot = true;
}
