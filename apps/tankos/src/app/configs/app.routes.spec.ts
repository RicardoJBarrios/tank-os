import { describe, expect, it, vi } from 'vitest';
import { authGuard } from '@tankos/authn';
import { appRoutes } from './app.routes';

vi.mock('@tankos/shell-ui', () => ({
  TankosDashboardComponent: class TankosDashboardComponent {
    public readonly marker = true;
  },
  TankosProfilePageComponent: class TankosProfilePageComponent {
    public readonly marker = true;
  },
}));
vi.mock('@tankos/authn-firebase-ui', () => ({
  FirebaseLoginPageComponent: class FirebaseLoginPageComponent {
    public readonly marker = true;
  },
}));
vi.mock('@tankos/units-ui', () => ({
  unitsRoutes: [{ path: '' }],
}));
vi.mock('@tankos/aquarium-ui', () => ({
  aquariumRoutes: [{ path: '' }],
  ACCESSIBLE_AQUARIUM_READER: Symbol('reader'),
  AQUARIUM_ESTABLISHER: Symbol('establisher'),
}));
vi.mock('@tankos/authz-ui', () => ({
  ForbiddenPageComponent: class ForbiddenPageComponent {
    public readonly marker = true;
  },
}));

describe('appRoutes', () => {
  it('Given TankOS routes, When the units route is read, Then it is lazy and owns the units path', () => {
    const unitsRoute = appRoutes.find((route) => route.path === 'units');
    expect(unitsRoute?.loadChildren).toBeTypeOf('function');
  });

  it('Given the units route, When its lazy component is loaded, Then it resolves the feature component', async () => {
    const unitsRoute = appRoutes.find((route) => route.path === 'units');
    await expect(unitsRoute?.loadChildren?.()).resolves.toBeDefined();
  });

  it('Given the Aquarium route, When its lazy feature is loaded, Then it resolves the feature routes', async () => {
    const aquariumRoute = appRoutes.find((route) => route.path === 'aquariums');
    await expect(aquariumRoute?.loadChildren?.()).resolves.toBeDefined();
  });

  it('keeps the shared dashboard as the root route', () => {
    const dashboardRoute = appRoutes.find((route) => route.path === '');
    expect(dashboardRoute?.component).toBeDefined();
  });

  it('loads the public login route without authentication', async () => {
    const loginRoute = appRoutes.find((route) => route.path === 'login');
    expect(loginRoute?.canActivate).toBeUndefined();
    await expect(loginRoute?.loadComponent?.()).resolves.toBeDefined();
  });

  it('loads the public forbidden route', async () => {
    const forbiddenRoute = appRoutes.find(
      (route) => route.path === 'forbidden',
    );
    await expect(forbiddenRoute?.loadComponent?.()).resolves.toBeDefined();
  });

  it('protects the profile route and loads the shared profile page', async () => {
    const profileRoute = appRoutes.find((route) => route.path === 'profile');
    expect(profileRoute?.canActivate).toContain(authGuard);
    expect(profileRoute?.component).toBeDefined();
  });
});
