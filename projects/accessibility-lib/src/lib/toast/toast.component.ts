import {
  Component, Input, Output, EventEmitter,
  ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { trigger, state, style, animate, transition } from '@angular/animations';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;   // ms, 0 = persistent
  action?: string;     // action button label
}

/**
 * A11yToastService
 * Call push() from anywhere to show a toast.
 */
@Injectable({ providedIn: 'root' })
export class A11yToastService {
  private _toasts$ = new Subject<Toast>();
  readonly toasts$ = this._toasts$.asObservable();

  push(toast: Omit<Toast, 'id'>): void {
    this._toasts$.next({ ...toast, id: Math.random().toString(36).slice(2, 8) });
  }

  success(message: string, duration = 4000): void { this.push({ message, type: 'success', duration }); }
  error(message: string,   duration = 0):    void { this.push({ message, type: 'error',   duration }); }
  warning(message: string, duration = 5000): void { this.push({ message, type: 'warning', duration }); }
  info(message: string,    duration = 4000): void { this.push({ message, type: 'info',    duration }); }
}

/**
 * A11yToastContainerComponent
 * Place <a11y-toast-container> once in your AppComponent template.
 *
 * WCAG 2.1/2.2 compliance:
 *   4.1.3  – role="status" (polite) for info/success; role="alert" (assertive) for error
 *   1.4.3  – Contrast ≥ 4.5:1 on all toast types
 *   2.1.1  – Dismiss with keyboard (Escape / close button)
 *   2.5.5  – Close button 44×44px target
 *   1.4.1  – Type conveyed with icon + text, not colour alone
 *   2.2.1  – Errors are persistent (duration 0); others auto-dismiss but can be extended
 */
@Component({
  selector: 'a11y-toast-container',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('toastAnim', [
      state('in',  style({ opacity: 1, transform: 'translateY(0)' })),
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(16px)' }),
        animate('200ms cubic-bezier(.34,1.56,.64,1)'),
      ]),
      transition(':leave', [
        animate('150ms ease', style({ opacity: 0, transform: 'translateY(-8px)' })),
      ]),
    ]),
  ],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
})
export class A11yToastContainerComponent implements OnInit, OnDestroy {
  @Output() action = new EventEmitter<{ toast: Toast; label: string }>();

  /** i18n-overridable strings — defaults preserve existing English behavior. */
  @Input() regionAriaLabel = 'Notifications';
  @Input() dismissLabelFn: (message: string) => string = (message) => `Dismiss: ${message}`;

  toasts: Toast[] = [];
  private timers = new Map<string, ReturnType<typeof setTimeout>>();
  private sub: any;

  constructor(private svc: A11yToastService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.sub = this.svc.toasts$.subscribe(t => this.add(t));
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.timers.forEach(t => clearTimeout(t));
  }

  add(toast: Toast): void {
    this.toasts = [...this.toasts, toast];
    this.cdr.markForCheck();
    if (toast.duration && toast.duration > 0) {
      this.timers.set(toast.id, setTimeout(() => this.dismiss(toast.id), toast.duration));
    }
  }

  dismiss(id: string): void {
    this.toasts = this.toasts.filter(t => t.id !== id);
    this.cdr.markForCheck();
    clearTimeout(this.timers.get(id));
    this.timers.delete(id);
  }

  iconFor(type: ToastType): string {
    return { success: 'check_circle', error: 'error', warning: 'warning', info: 'info' }[type];
  }

  trackById(_: number, t: Toast): string { return t.id; }
}
