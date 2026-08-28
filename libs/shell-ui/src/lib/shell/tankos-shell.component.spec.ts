import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AUTH_SESSION } from '@tankos/authn';
import { describe, expect, it, vi } from 'vitest';
import { TankosShellComponent } from './tankos-shell.component';

describe('TankosShellComponent', () => {
  const createFixture = async (
    session: { signOut: () => Promise<void> } | null = {
      signOut: vi.fn(() => Promise.resolve()),
    },
  ) => {
    TestBed.overrideComponent(TankosShellComponent, {
      set: { imports: [], schemas: [NO_ERRORS_SCHEMA] },
    });
    await TestBed.configureTestingModule({
      imports: [TankosShellComponent],
      providers: [
        { provide: Router, useValue: { navigate: vi.fn() } },
        { provide: AUTH_SESSION, useValue: session },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(TankosShellComponent);
    fixture.detectChanges();
    return fixture;
  };

  it('renders the shared navigation', async () => {
    const fixture = await createFixture();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('.brand')?.textContent).toContain('TankOS');
    expect(element.textContent).toContain('Units');
    expect(element.textContent).toContain('Aquariums');
    expect(
      element.querySelector('[data-testid="account-menu-trigger"]'),
    ).not.toBeNull();
  });

  it('signs out through the configured authentication port', async () => {
    const signOut = vi.fn(() => Promise.resolve());
    const fixture = await createFixture({ signOut });
    vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);

    await (
      fixture.componentInstance as unknown as { logout: () => Promise<void> }
    ).logout();

    await vi.waitFor(() => {
      expect(signOut).toHaveBeenCalledOnce();
    });
  });

  it('keeps the shell usable without an authentication provider', async () => {
    const fixture = await createFixture(null);

    void (
      fixture.componentInstance as unknown as { logout: () => Promise<void> }
    ).logout();

    expect(fixture.componentInstance).toBeDefined();
  });
});
