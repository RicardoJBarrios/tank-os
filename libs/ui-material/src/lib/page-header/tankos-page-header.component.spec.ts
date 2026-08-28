import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { TankosPageHeaderComponent } from './tankos-page-header.component';

describe('TankosPageHeaderComponent', () => {
  it('renders the shared page heading contract', async () => {
    await TestBed.configureTestingModule({
      imports: [TankosPageHeaderComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(TankosPageHeaderComponent);
    fixture.componentRef.setInput('title', 'Aquariums');
    fixture.componentRef.setInput('description', 'Manage systems');
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('Aquariums');
    expect(element.textContent).toContain('Manage systems');
  });
});
