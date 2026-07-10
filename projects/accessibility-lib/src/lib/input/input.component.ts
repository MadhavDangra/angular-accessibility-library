import {
  Component, Input, Output, EventEmitter,
  ChangeDetectionStrategy, OnInit, forwardRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

export type InputType = 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'search';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

/**
 * A11yInputComponent
 * ─────────────────────────────────────────────
 * WCAG 2.1/2.2 compliance:
 *   1.3.1  – Explicit <label> with for/id linkage
 *   3.3.2  – aria-required, hint via aria-describedby
 *   3.3.1  – aria-invalid + live error region
 *   4.1.3  – role="alert" for error messages
 *   1.4.1  – Error marked with icon, not colour alone
 *   2.4.7  – Visible focus ring
 */
@Component({
  selector: 'a11y-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => A11yInputComponent),
    multi: true,
  }],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class A11yInputComponent implements ControlValueAccessor, OnInit {
  @Input() label = '';
  @Input() type: InputType = 'text';
  @Input() placeholder = '';
  @Input() required = false;
  @Input() disabled = false;
  @Input() hint = '';
  @Input() errorMessage = '';
  @Input() prefixIcon = '';
  @Input() name = '';
  @Input() options: SelectOption[] = [];
  @Input() fieldId = `a11y-input-${Math.random().toString(36).slice(2, 7)}`;

  /** i18n-overridable strings — defaults preserve existing English behavior. */
  @Input() requiredIndicatorText = '(required)';
  @Input() selectPlaceholderLabel = 'Select…';
  @Input() showPasswordLabel = 'Show password';
  @Input() hidePasswordLabel = 'Hide password';

  value: string | number = '';
  showPw = false;

  get hasError(): boolean { return !!this.errorMessage; }
  get hintId():  string   { return `${this.fieldId}-hint`; }
  get errorId(): string   { return `${this.fieldId}-error`; }
  get ariaDescribedBy(): string | null {
    const ids = [...(this.hint ? [this.hintId] : []), ...(this.hasError ? [this.errorId] : [])];
    return ids.length ? ids.join(' ') : null;
  }

  ngOnInit(): void { if (!this.name) this.name = this.fieldId; }

  private onChange: (v: string | number) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(v: string | number): void   { this.value = v ?? ''; }
  registerOnChange(fn: (v: string | number) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(d: boolean): void     { this.disabled = d; }

  onInput(e: Event): void {
    const v = (e.target as HTMLInputElement).value;
    this.value = v; this.onChange(v);
  }
  onSelectChange(e: Event): void {
    const v = (e.target as HTMLSelectElement).value;
    this.value = v; this.onChange(v);
  }
}
