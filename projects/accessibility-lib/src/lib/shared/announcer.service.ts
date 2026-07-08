import { Injectable, OnDestroy } from '@angular/core';

/**
 * A11yAnnouncerService
 * Programmatically push messages into aria-live regions.
 * WCAG 4.1.3 — Status Messages
 *
 * Usage:
 *   this.announcer.announce('3 results loaded');
 *   this.announcer.announceAssertive('Error: form submission failed');
 */
@Injectable({ providedIn: 'root' })
export class A11yAnnouncerService implements OnDestroy {
  private politeEl!: HTMLElement;
  private assertiveEl!: HTMLElement;

  constructor() {
    this.politeEl    = this.createRegion('polite');
    this.assertiveEl = this.createRegion('assertive');
  }

  /** Non-interrupting — screen reader finishes current before announcing. */
  announce(message: string): void {
    this.set(this.politeEl, message);
  }

  /** Interrupts current speech — use for errors and critical alerts. */
  announceAssertive(message: string): void {
    this.set(this.assertiveEl, message);
  }

  private createRegion(politeness: 'polite' | 'assertive'): HTMLElement {
    const el = document.createElement('div');
    el.setAttribute('aria-live', politeness);
    el.setAttribute('aria-atomic', 'true');
    el.style.cssText =
      'position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;';
    document.body.appendChild(el);
    return el;
  }

  private set(el: HTMLElement, msg: string): void {
    // Clear then re-set forces re-read in all major screen readers
    el.textContent = '';
    requestAnimationFrame(() => { el.textContent = msg; });
  }

  ngOnDestroy(): void {
    this.politeEl?.remove();
    this.assertiveEl?.remove();
  }
}
