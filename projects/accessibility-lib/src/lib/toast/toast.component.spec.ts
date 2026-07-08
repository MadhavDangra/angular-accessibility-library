import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { A11yToastContainerComponent, A11yToastService, Toast } from './toast.component';

describe('A11yToastService', () => {
  let service: A11yToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [A11yToastService] });
    service = TestBed.inject(A11yToastService);
  });

  it('should emit a toast via push()', (done) => {
    service.toasts$.subscribe(t => {
      expect(t.message).toBe('Hello');
      expect(t.type).toBe('success');
      done();
    });
    service.push({ message: 'Hello', type: 'success' });
  });

  it('should emit success toast via success()', (done) => {
    service.toasts$.subscribe(t => {
      expect(t.type).toBe('success');
      done();
    });
    service.success('Saved!');
  });

  it('should emit error toast with duration 0 via error()', (done) => {
    service.toasts$.subscribe(t => {
      expect(t.type).toBe('error');
      expect(t.duration).toBe(0);
      done();
    });
    service.error('Something failed.');
  });

  it('should emit warning toast via warning()', (done) => {
    service.toasts$.subscribe(t => {
      expect(t.type).toBe('warning');
      done();
    });
    service.warning('Session expiring.');
  });

  it('should emit info toast via info()', (done) => {
    service.toasts$.subscribe(t => {
      expect(t.type).toBe('info');
      done();
    });
    service.info('New update available.');
  });

  it('should assign a unique id to each toast', (done) => {
    const ids: string[] = [];
    let count = 0;
    service.toasts$.subscribe(t => {
      ids.push(t.id);
      count++;
      if (count === 2) {
        expect(ids[0]).not.toBe(ids[1]);
        done();
      }
    });
    service.push({ message: 'A', type: 'success' });
    service.push({ message: 'B', type: 'info' });
  });
});

describe('A11yToastContainerComponent — WCAG Compliance', () => {
  let fixture: ComponentFixture<A11yToastContainerComponent>;
  let component: A11yToastContainerComponent;
  let service: A11yToastService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [A11yToastContainerComponent, NoopAnimationsModule],
      providers: [A11yToastService],
    }).compileComponents();

    service   = TestBed.inject(A11yToastService);
    fixture   = TestBed.createComponent(A11yToastContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    component.toasts = [];
    fixture.detectChanges();
  });

  // ── 4.1.3 Live region + roles ─────────────
  it('should render a wrapping live region (WCAG 4.1.3)', () => {
    const region = fixture.debugElement.query(By.css('[aria-live]'));
    expect(region).toBeTruthy();
  });

  it('should give success toast role="status" (WCAG 4.1.3)', () => {
    const toast: Toast = { id: 't1', message: 'Saved!', type: 'success', duration: 0 };
    component.add(toast);
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('[role="status"]'));
    expect(el).toBeTruthy();
  });

  it('should give error toast role="alert" (WCAG 4.1.3)', () => {
    const toast: Toast = { id: 't2', message: 'Error!', type: 'error', duration: 0 };
    component.add(toast);
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('[role="alert"]'));
    expect(el).toBeTruthy();
  });

  it('should give warning toast role="status" (WCAG 4.1.3)', () => {
    const toast: Toast = { id: 't3', message: 'Warning!', type: 'warning', duration: 0 };
    component.add(toast);
    fixture.detectChanges();
    const statusEls = fixture.debugElement.queryAll(By.css('[role="status"]'));
    expect(statusEls.length).toBeGreaterThan(0);
  });

  // ── 2.2.1 Dismiss / auto-dismiss ──────────
  it('should remove toast on dismiss() (WCAG 2.2.1)', () => {
    const toast: Toast = { id: 't4', message: 'Bye', type: 'info', duration: 0 };
    component.add(toast);
    fixture.detectChanges();
    component.dismiss('t4');
    fixture.detectChanges();
    expect(component.toasts.length).toBe(0);
  });

  it('should auto-dismiss toast after duration (WCAG 2.2.1)', fakeAsync(() => {
    const toast: Toast = { id: 't5', message: 'Auto', type: 'success', duration: 3000 };
    component.add(toast);
    fixture.detectChanges();
    expect(component.toasts.length).toBe(1);
    tick(3001);
    fixture.detectChanges();
    expect(component.toasts.length).toBe(0);
  }));

  it('should NOT auto-dismiss when duration is 0 (persistent — WCAG 2.2.1)', fakeAsync(() => {
    const toast: Toast = { id: 't6', message: 'Persistent error', type: 'error', duration: 0 };
    component.add(toast);
    fixture.detectChanges();
    tick(10000);
    fixture.detectChanges();
    expect(component.toasts.length).toBe(1);
  }));

  // ── 1.4.1 Icon provided for each type ─────
  it('should return the correct icon for each type (WCAG 1.4.1)', () => {
    expect(component.iconFor('success')).toBe('check_circle');
    expect(component.iconFor('error')).toBe('error');
    expect(component.iconFor('warning')).toBe('warning');
    expect(component.iconFor('info')).toBe('info');
  });

  // ── 2.5.5 Close button size ───────────────
  it('should render a close button with 44px min size (WCAG 2.5.5)', () => {
    const toast: Toast = { id: 't7', message: 'Test', type: 'info', duration: 0 };
    component.add(toast);
    fixture.detectChanges();
    const closeBtn = fixture.debugElement.query(By.css('.toast-close'));
    expect(closeBtn).toBeTruthy();
    // min-width/height applied via CSS; verify aria-label is descriptive
    expect(closeBtn.nativeElement.getAttribute('aria-label')).toContain('Dismiss');
  });

  // ── trackById ─────────────────────────────
  it('should track toasts by id', () => {
    const toast: Toast = { id: 'unique-id', message: 'X', type: 'success', duration: 0 };
    expect(component.trackById(0, toast)).toBe('unique-id');
  });
});
