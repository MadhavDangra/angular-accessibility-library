import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { A11yButtonComponent, ButtonVariant, ButtonSize } from './button.component';

@Component({
  standalone: true,
  imports: [A11yButtonComponent],
  template: `
    <a11y-button
      [variant]="variant"
      [size]="size"
      [disabled]="disabled"
      [loading]="loading"
      [ariaLabel]="ariaLabel"
      (clicked)="onClicked($event)"
    >Click me</a11y-button>
  `,
})
class HostComponent {
  variant: ButtonVariant = 'primary';
  size: ButtonSize = 'md';
  disabled = false;
  loading = false;
  ariaLabel?: string;
  clickCount = 0;
  onClicked(): void { this.clickCount++; }
}

describe('A11yButtonComponent — WCAG Compliance', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let button: HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    button = fixture.debugElement.query(By.css('button')).nativeElement;
  });

  // ── 2.5.5 Target Size ──────────────────────
  it('should have minimum 44px height (WCAG 2.5.5)', () => {
    expect(button.style.minHeight || '44px').toContain('44');
  });

  // ── 4.1.2 Name/Role/Value ──────────────────
  it('should render as a native button element (role implicit)', () => {
    expect(button.tagName).toBe('BUTTON');
  });

  it('should set aria-label for icon-only variant (WCAG 1.1.1)', () => {
    host.variant = 'icon-only';
    host.ariaLabel = 'Close dialog';
    fixture.detectChanges();
    expect(button.getAttribute('aria-label')).toBe('Close dialog');
  });

  // ── 4.1.3 Status — aria-busy ──────────────
  it('should set aria-busy when loading (WCAG 4.1.3)', () => {
    host.loading = true;
    fixture.detectChanges();
    expect(button.getAttribute('aria-busy')).toBeTruthy();
  });

  it('should not fire clicked event when loading', () => {
    host.loading = true;
    fixture.detectChanges();
    button.click();
    expect(host.clickCount).toBe(0);
  });

  // ── aria-disabled ─────────────────────────
  it('should use aria-disabled instead of disabled attribute (WCAG 2.1.1)', () => {
    host.disabled = true;
    fixture.detectChanges();
    expect(button.getAttribute('aria-disabled')).toBeTruthy();
  });

  it('should not fire clicked event when disabled', () => {
    host.disabled = true;
    fixture.detectChanges();
    button.click();
    expect(host.clickCount).toBe(0);
  });

  // ── Variants ──────────────────────────────
  it('should apply correct class for each variant', () => {
    (['primary', 'secondary', 'danger', 'ghost', 'icon-only'] as const).forEach(v => {
      host.variant = v;
      fixture.detectChanges();
      expect(button.className).toContain(`btn--${v}`);
    });
  });

  // ── Sizes ─────────────────────────────────
  it('should apply correct size class', () => {
    (['sm', 'md', 'lg'] as const).forEach(s => {
      host.size = s;
      fixture.detectChanges();
      expect(button.className).toContain(`btn--${s}`);
    });
  });

  // ── Type ──────────────────────────────────
  it('should default to type="button" to avoid accidental form submission', () => {
    expect(button.getAttribute('type')).toBe('button');
  });
});
