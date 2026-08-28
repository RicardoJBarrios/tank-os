import type { Route } from '@angular/router';
import { authGuard } from '@tankos/authn';
import {
  TankosDashboardComponent,
  TankosProfilePageComponent,
} from '@tankos/shell-ui';

export const appRoutes: Route[] = [
  {
    path: 'login',
    loadComponent: () =>
      import('@tankos/authn-firebase-ui').then(
        ({ FirebaseLoginPageComponent }) => FirebaseLoginPageComponent,
      ),
  },
  {
    path: '',
    component: TankosDashboardComponent,
  },
  {
    path: 'forbidden',
    loadComponent: () =>
      import('@tankos/authz-ui').then(
        ({ ForbiddenPageComponent }) => ForbiddenPageComponent,
      ),
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    component: TankosProfilePageComponent,
  },
  {
    path: 'units',
    loadChildren: () =>
      Promise.all([
        import('@tankos/units-ui'),
        import('./units.providers'),
      ]).then(([ui, composition]) => [
        {
          path: '',
          providers: [composition.provideTankosUnitsFirestoreAdapter()],
          children: ui.unitsRoutes,
        },
      ]),
  },
  {
    path: 'aquariums',
    loadChildren: () =>
      Promise.all([
        import('@tankos/aquarium-ui'),
        import('./aquarium.providers'),
      ]).then(([ui, composition]) => [
        {
          path: '',
          providers: composition.provideTankosAquarium(),
          children: ui.aquariumRoutes,
        },
      ]),
  },
];
