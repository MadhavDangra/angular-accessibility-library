import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { A11yAnnouncerService } from './announcer.service';

describe('A11yAnnouncerService — WCAG 4.1.3', () => {
  let service: A11yAnnouncerService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [A11yAnnouncerService] });
    service = TestBed.inject(A11yAnnouncerService);
  });

  afterEach(() => {
    service.ngOnDestroy();
  });

  it('should create two live region elements on the DOM', () => {
    const polite    = document.querySelector('[aria-live="polite"]');
    const assertive = document.querySelector('[aria-live="assertive"]');
    expect(polite).toBeTruthy();
    expect(assertive).toBeTruthy();
  });

  it('should set text in polite region via announce()', fakeAsync(() => {
    service.announce('3 results loaded');
    tick(100);
    const polite = document.querySelector('[aria-live="polite"]');
    expect(polite?.textContent).toBe('3 results loaded');
  }));

  it('should set text in assertive region via announceAssertive()', fakeAsync(() => {
    service.announceAssertive('Error: form invalid');
    tick(100);
    const assertive = document.querySelector('[aria-live="assertive"]');
    expect(assertive?.textContent).toBe('Error: form invalid');
  }));

  it('should clear and re-set text to force re-announcement', fakeAsync(() => {
    service.announce('First message');
    tick(100);
    service.announce('First message'); // same text again
    tick(100);
    const polite = document.querySelector('[aria-live="polite"]');
    expect(polite?.textContent).toBe('First message');
  }));

  it('should remove elements on destroy', () => {
    service.ngOnDestroy();
    const polite    = document.querySelector('[aria-live="polite"]');
    const assertive = document.querySelector('[aria-live="assertive"]');
    expect(polite).toBeNull();
    expect(assertive).toBeNull();
  });
});
