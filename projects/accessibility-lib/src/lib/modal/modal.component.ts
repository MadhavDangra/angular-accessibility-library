import {
  Component, Input, Output, EventEmitter,
  OnChanges, SimpleChanges, ElementRef,
  AfterViewInit, OnDestroy, ViewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { A11yButtonComponent } from '../button/button.component';

export type ModalSize = 'sm' | 'md' | 'lg' | 'fullscreen';

/**
 * A11yModalComponent
 * ─────────────────────────────────────────────
 * WCAG 2.1/2.2 compliance:
 *   2.1.2  – No keyboard trap: Tab/Shift+Tab cycles within; Escape exits
 *   2.4.3  – Focus returns to trigger element on close
 *   2.4.7  – Visible focus ring
 *   1.3.1  – role="dialog", aria-modal, aria-labelledby, aria-describedby
 *   4.1.2  – Name/Role/Value: all interactive elements labelled
 */
@Component({
  selector: 'a11y-modal',
  standalone: true,
  imports: [CommonModule, MatIconModule, A11yButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class A11yModalComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input() open = false;
  @Input() title = 'Dialog';
  @Input() size: ModalSize = 'md';
  @Input() closeOnBackdrop = true;
  @Input() showFooter = true;
  @Input() icon = '';
  @Input() hasFooterContent = false;

  @Output() closed    = new EventEmitter<void>();
  @Output() confirmed = new EventEmitter<void>();

  @ViewChild('dialogEl') dialogEl?: ElementRef<HTMLElement>;

  titleId = `modal-title-${Math.random().toString(36).slice(2, 7)}`;
  bodyId  = `modal-body-${Math.random().toString(36).slice(2, 7)}`;

  private triggerEl: HTMLElement | null = null;
  private focusable =
    'a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

  ngOnChanges(c: SimpleChanges): void {
    if (c['open']) {
      if (this.open) {
        this.triggerEl = document.activeElement as HTMLElement;
        document.body.style.overflow = 'hidden';
        setTimeout(() => this.focusFirst(), 60);
      } else {
        document.body.style.overflow = '';
        this.triggerEl?.focus();
      }
    }
  }

  ngAfterViewInit(): void {}
  ngOnDestroy(): void { document.body.style.overflow = ''; }
  close(): void { this.closed.emit(); }

  onKeydown(e: KeyboardEvent): void {
    if (e.key === 'Escape') { e.preventDefault(); this.close(); return; }
    if (e.key === 'Tab') this.trapFocus(e);
  }

  private trapFocus(e: KeyboardEvent): void {
    const el = this.dialogEl?.nativeElement;
    if (!el) return;
    const items = Array.from(el.querySelectorAll<HTMLElement>(this.focusable))
      .filter(el => !el.closest('[aria-hidden="true"]'));
    if (!items.length) { e.preventDefault(); return; }
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  private focusFirst(): void {
    const el = this.dialogEl?.nativeElement;
    if (!el) return;
    (el.querySelector<HTMLElement>(this.focusable) || el).focus();
  }
}
