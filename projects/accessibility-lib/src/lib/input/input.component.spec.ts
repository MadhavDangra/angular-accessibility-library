import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { A11yInputComponent, InputType, SelectOption } from './input.component';

@Component({
  standalone: true,
  imports: [A11yInputComponent, ReactiveFormsModule],
  template: `
    <a11y-input
      [label]="label"
      [type]="type"
      [required]="required"
      [hint]="hint"
      [errorMessage]="errorMessage"
      [disabled]="disabled"
      [options]="options"
    ></a11y-input>
  `,
})
class HostComponent {
  label = 'Email';
  type: InputType = 'email';
  required = false;
  hint = '';
  errorMessage = '';
  disabled = false;
  options: SelectOption[] = [];
}

describe('A11yInputComponent — WCAG Compliance', () => {
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

  function inputComponent(): A11yInputComponent {
    return fixture.debugElement.query(By.directive(A11yInputComponent)).componentInstance;
  }

  // ── 1.3.1 Explicit label linkage ───────────
  it('should render a <label> element linked to the input (WCAG 1.3.1)', () => {
    const label = fixture.debugElement.query(By.css('label'));
    const input = fixture.debugElement.query(By.css('input'));
    expect(label).toBeTruthy();
    expect(label.nativeElement.htmlFor).toBe(input.nativeElement.id);
  });

  it('should show label text', () => {
    const label = fixture.debugElement.query(By.css('label'));
    expect(label.nativeElement.textContent).toContain('Email');
  });

  // ── 3.3.2 aria-required ────────────────────
  it('should set aria-required when required=true (WCAG 3.3.2)', () => {
    host.required = true;
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input'));
    expect(input.nativeElement.getAttribute('aria-required')).toBe('true');
  });

  it('should include sr-only "(required)" text for screen readers (WCAG 3.3.2)', () => {
    host.required = true;
    fixture.detectChanges();
    const srOnly = fixture.debugElement.query(By.css('.sr-only'));
    expect(srOnly.nativeElement.textContent).toContain('required');
  });

  // ── 3.3.2 Hint via aria-describedby ────────
  it('should link hint text via aria-describedby (WCAG 3.3.2)', () => {
    host.hint = 'Enter a valid email';
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input'));
    const describedBy = input.nativeElement.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    const hintEl = fixture.debugElement.query(By.css(`#${describedBy}`));
    expect(hintEl).toBeTruthy();
    expect(hintEl.nativeElement.textContent).toContain('Enter a valid email');
  });

  // ── 3.3.1 aria-invalid + live error region ─
  it('should set aria-invalid when errorMessage is provided (WCAG 3.3.1)', () => {
    host.errorMessage = 'Invalid email address.';
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input'));
    expect(input.nativeElement.getAttribute('aria-invalid')).toBe('true');
  });

  it('should render error with role="alert" (WCAG 4.1.3)', () => {
    host.errorMessage = 'Invalid email address.';
    fixture.detectChanges();
    const err = fixture.debugElement.query(By.css('[role="alert"]'));
    expect(err).toBeTruthy();
    expect(err.nativeElement.textContent).toContain('Invalid email address.');
  });

  it('should link error to input via aria-describedby (WCAG 3.3.1)', () => {
    host.errorMessage = 'Error!';
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input'));
    const errorId = inputComponent().errorId;
    expect(input.nativeElement.getAttribute('aria-describedby')).toContain(errorId);
  });

  // ── Password toggle ────────────────────────
  it('should render password input as type="password" by default', () => {
    host.type = 'password';
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input[type="password"]'));
    expect(input).toBeTruthy();
  });

  it('should toggle password visibility and update aria-label (WCAG 4.1.2)', () => {
    host.type = 'password';
    fixture.detectChanges();
    const toggleBtn = fixture.debugElement.query(By.css('.pw-toggle'));
    expect(toggleBtn.nativeElement.getAttribute('aria-label')).toBe('Show password');
    toggleBtn.nativeElement.click();
    fixture.detectChanges();
    expect(toggleBtn.nativeElement.getAttribute('aria-label')).toBe('Hide password');
    expect(toggleBtn.nativeElement.getAttribute('aria-pressed')).toBe('true');
  });

  // ── Textarea ───────────────────────────────
  it('should render <textarea> for type="textarea"', () => {
    host.type = 'textarea';
    fixture.detectChanges();
    const ta = fixture.debugElement.query(By.css('textarea'));
    expect(ta).toBeTruthy();
  });

  // ── Select ────────────────────────────────
  it('should render <select> for type="select"', () => {
    host.type = 'select';
    host.options = [{ value: '1', label: 'Option 1' }];
    fixture.detectChanges();
    const sel = fixture.debugElement.query(By.css('select'));
    expect(sel).toBeTruthy();
  });

  // ── Disabled state ─────────────────────────
  it('should disable the input when disabled=true', () => {
    host.disabled = true;
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input'));
    expect(input.nativeElement.disabled).toBe(true);
  });

  // ── ControlValueAccessor ───────────────────
  it('should implement writeValue without error', () => {
    const component = inputComponent();
    expect(() => component.writeValue('test@example.com')).not.toThrow();
    expect(component.value).toBe('test@example.com');
  });

  it('should implement setDisabledState', () => {
    const component = inputComponent();
    component.setDisabledState(true);
    expect(component.disabled).toBe(true);
    component.setDisabledState(false);
    expect(component.disabled).toBe(false);
  });
});
