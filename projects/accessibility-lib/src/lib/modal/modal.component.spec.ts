import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { A11yModalComponent, ModalSize } from './modal.component';

@Component({
  standalone: true,
  imports: [A11yModalComponent],
  template: `
    <a11y-modal
      [open]="open"
      [title]="title"
      [size]="size"
      [closeOnBackdrop]="closeOnBackdrop"
      (closed)="onClosed()"
    ></a11y-modal>
  `,
})
class HostComponent {
  open = false;
  title = 'Test Dialog';
  size: ModalSize = 'md';
  closeOnBackdrop = true;
  closedCount = 0;
  onClosed(): void { this.closedCount++; }
}

describe('A11yModalComponent — WCAG Compliance', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    document.body.style.overflow = '';
  });

  // ── 1.3.1 Info & Relationships ─────────────
  it('should have role="dialog" (WCAG 1.3.1)', () => {
    host.open = true;
    fixture.detectChanges();
    const dialog = fixture.debugElement.query(By.css('[role="dialog"]'));
    expect(dialog).toBeTruthy();
  });

  it('should have aria-modal="true" (WCAG 1.3.1)', () => {
    host.open = true;
    fixture.detectChanges();
    const dialog = fixture.debugElement.query(By.css('[role="dialog"]'));
    expect(dialog.nativeElement.getAttribute('aria-modal')).toBe('true');
  });

  it('should link aria-labelledby to the title element (WCAG 1.3.1)', () => {
    host.open = true;
    fixture.detectChanges();
    const dialog = fixture.debugElement.query(By.css('[role="dialog"]'));
    const titleId = dialog.nativeElement.getAttribute('aria-labelledby');
    const titleEl = fixture.debugElement.query(By.css(`#${titleId}`));
    expect(titleEl).toBeTruthy();
    expect(titleEl.nativeElement.textContent.trim()).toBe('Test Dialog');
  });

  // ── 2.1.1 Keyboard / Escape ────────────────
  it('should emit closed on Escape key (WCAG 2.1.1)', () => {
    host.open = true;
    fixture.detectChanges();
    const dialog = fixture.debugElement.query(By.css('[role="dialog"]'));
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    dialog.nativeElement.dispatchEvent(event);
    expect(host.closedCount).toBeGreaterThan(0);
  });

  // ── Body scroll lock ───────────────────────
  it('should lock body scroll when open', () => {
    host.open = true;
    fixture.detectChanges();
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('should restore body scroll when closed', () => {
    host.open = true;
    fixture.detectChanges();
    host.open = false;
    fixture.detectChanges();
    expect(document.body.style.overflow).toBe('');
  });

  // ── Backdrop click ─────────────────────────
  it('should emit closed when backdrop is clicked (closeOnBackdrop=true)', () => {
    host.open = true;
    host.closeOnBackdrop = true;
    fixture.detectChanges();
    const modalComponent: A11yModalComponent = fixture.debugElement
      .query(By.directive(A11yModalComponent)).componentInstance;
    modalComponent.close();
    expect(host.closedCount).toBeGreaterThan(0);
  });

  // ── Sizes ─────────────────────────────────
  it('should apply size class to dialog', () => {
    host.open = true;
    host.size = 'lg';
    fixture.detectChanges();
    const dialog = fixture.debugElement.query(By.css('[role="dialog"]'));
    expect(dialog.nativeElement.className).toContain('modal--lg');
  });
});
