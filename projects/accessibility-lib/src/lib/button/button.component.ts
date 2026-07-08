import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'icon-only';
export type ButtonSize    = 'sm' | 'md' | 'lg';

/**
 * A11yButtonComponent
 * ─────────────────────────────────────────────
 * WCAG 2.1/2.2 compliance:
 *   2.1.1  – Keyboard: Enter & Space activate button
 *   2.4.7  – Focus Visible: 3px focus ring
 *   2.5.5  – Target Size: min 44×44px
 *   1.4.3  – Contrast: ≥4.5:1 on all variants
 *   1.1.1  – Non-text: icon-only requires ariaLabel
 *   4.1.2  – Name/Role/Value: aria-disabled, aria-busy
 *   4.1.3  – Status: aria-busy during loading
 */
@Component({
  selector: 'a11y-button',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class A11yButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() leftIcon?: string;
  @Input() rightIcon?: string;
  @Input() ariaLabel?: string;
  @Input() ariaDescribedBy?: string;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Output() clicked = new EventEmitter<MouseEvent>();

  get buttonClasses(): string {
    return [`btn--${this.variant}`, `btn--${this.size}`, this.loading ? 'btn--loading' : '']
      .filter(Boolean).join(' ');
  }

  handleClick(event: MouseEvent): void {
    if (this.disabled || this.loading) { event.preventDefault(); event.stopPropagation(); return; }
    this.clicked.emit(event);
  }
}
