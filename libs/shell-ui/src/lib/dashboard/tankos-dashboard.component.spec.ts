import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { TankosDashboardComponent } from './tankos-dashboard.component';

describe('TankosDashboardComponent', () => {
  it('renders the shared workspace entry points', async () => {
    TestBed.overrideComponent(TankosDashboardComponent, {
      set: { imports: [], schemas: [CUSTOM_ELEMENTS_SCHEMA] },
    });
    await TestBed.configureTestingModule({
      imports: [TankosDashboardComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(TankosDashboardComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('#dashboard-title')?.textContent).toContain(
      'Good morning',
    );
    expect(element.textContent).toContain('Open units');
    expect(element.textContent).toContain('Open aquariums');
  });
});
