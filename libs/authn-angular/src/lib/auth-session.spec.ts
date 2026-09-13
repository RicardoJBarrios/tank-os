import { TestBed } from '@angular/core/testing';
import {
  provideRouter,
  UrlTree,
  type RouterStateSnapshot,
} from '@angular/router';
import { describe, expect, it, vi } from 'vitest';
import type { AuthSessionPort } from '@tankos/authn';
import { authGuard, provideAuthSession } from './auth-session';

function session(principal: AuthSessionPort['principal']): AuthSessionPort {
  return { principal, signIn: vi.fn(), signOut: vi.fn(), refresh: vi.fn() };
}

describe('authn Angular composition', () => {
  it('allows an authenticated principal', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideAuthSession(
          session(() => Promise.resolve({ id: 'keeper' as never, claims: {} })),
        ),
        provideRouter([]),
      ],
    });
    await expect(
      TestBed.runInInjectionContext(() => authGuard()),
    ).resolves.toBe(true);
  });

  it('redirects unauthenticated routes with and without an explicit URL', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideAuthSession(
          session(() => Promise.reject(new Error('signed out'))),
        ),
        provideRouter([]),
      ],
    });
    await expect(
      TestBed.runInInjectionContext(() =>
        authGuard(undefined, { url: '/units' } as RouterStateSnapshot),
      ),
    ).resolves.toBeInstanceOf(UrlTree);
    await expect(
      TestBed.runInInjectionContext(() => authGuard()),
    ).resolves.toBeInstanceOf(UrlTree);
  });
});
