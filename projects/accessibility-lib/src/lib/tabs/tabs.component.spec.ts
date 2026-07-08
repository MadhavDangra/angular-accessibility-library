import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Component } from '@angular/core';
import { A11yTabsComponent, A11yTabDirective } from './tabs.component';

@Component({
  standalone: true,
  imports: [A11yTabsComponent, A11yTabDirective],
  template: `
    <a11y-tabs ariaLabel="Test tabs">
      <a11y-tab label="Tab One"   icon="home">Panel 1 content</a11y-tab>
      <a11y-tab label="Tab Two"   icon="star">Panel 2 content</a11y-tab>
      <a11y-tab label="Tab Three" icon="info">Panel 3 content</a11y-tab>
      <a11y-tab label="Disabled"  [disabled]="true">Disabled content</a11y-tab>
    </a11y-tabs>
  `,
})
class HostComponent {}

describe('A11yTabsComponent — WCAG Compliance', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent, NoopAnimationsModule],
    }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  // ── 1.3.1 Roles ───────────────────────────
  it('should have role="tablist" with aria-label (WCAG 1.3.1)', () => {
    const tablist = fixture.debugElement.query(By.css('[role="tablist"]'));
    expect(tablist).toBeTruthy();
    expect(tablist.nativeElement.getAttribute('aria-label')).toBe('Test tabs');
  });

  it('should render all tabs with role="tab" (WCAG 1.3.1)', () => {
    const tabs = fixture.debugElement.queryAll(By.css('[role="tab"]'));
    expect(tabs.length).toBe(4);
  });

  it('should render panels with role="tabpanel" (WCAG 1.3.1)', () => {
    const panels = fixture.debugElement.queryAll(By.css('[role="tabpanel"]'));
    expect(panels.length).toBe(4);
  });

  // ── 4.1.2 aria-selected ───────────────────
  it('should set aria-selected="true" on first tab by default (WCAG 4.1.2)', () => {
    const tabs = fixture.debugElement.queryAll(By.css('[role="tab"]'));
    expect(tabs[0].nativeElement.getAttribute('aria-selected')).toBe('true');
    expect(tabs[1].nativeElement.getAttribute('aria-selected')).toBe('false');
  });

  // ── 4.1.2 aria-controls ───────────────────
  it('should link each tab to its panel via aria-controls (WCAG 4.1.2)', () => {
    const tabs = fixture.debugElement.queryAll(By.css('[role="tab"]'));
    tabs.forEach(tab => {
      const panelId = tab.nativeElement.getAttribute('aria-controls');
      const panel   = fixture.debugElement.query(By.css(`#${panelId}`));
      expect(panel).toBeTruthy();
    });
  });

  // ── 2.4.3 tabindex ────────────────────────
  it('should give active tab tabindex="0" and others tabindex="-1" (WCAG 2.4.3)', () => {
    const tabs = fixture.debugElement.queryAll(By.css('[role="tab"]'));
    expect(tabs[0].nativeElement.getAttribute('tabindex')).toBe('0');
    expect(tabs[1].nativeElement.getAttribute('tabindex')).toBe('-1');
  });

  // ── Panel visibility ──────────────────────
  it('should show first panel and hide others', () => {
    const panels = fixture.debugElement.queryAll(By.css('[role="tabpanel"]'));
    expect(panels[0].nativeElement.style.display).not.toBe('none');
    expect(panels[1].nativeElement.style.display).toBe('none');
  });

  // ── Tab selection ─────────────────────────
  it('should update activeIndex and panel visibility on select()', () => {
    const comp = fixture.debugElement.query(By.directive(A11yTabsComponent))
      .componentInstance as A11yTabsComponent;
    comp.select(1);
    fixture.detectChanges();
    const panels = fixture.debugElement.queryAll(By.css('[role="tabpanel"]'));
    expect(panels[0].nativeElement.style.display).toBe('none');
    expect(panels[1].nativeElement.style.display).not.toBe('none');
  });

  // ── Output ────────────────────────────────
  it('should emit tabChanged on select', () => {
    const comp = fixture.debugElement.query(By.directive(A11yTabsComponent))
      .componentInstance as A11yTabsComponent;
    const spy = jest.fn();
    comp.tabChanged.subscribe(spy);
    comp.select(2);
    expect(spy).toHaveBeenCalledWith(2);
  });

  // ── Disabled tab ──────────────────────────
  it('should set aria-disabled on disabled tab (WCAG 4.1.2)', () => {
    const tabs = fixture.debugElement.queryAll(By.css('[role="tab"]'));
    expect(tabs[3].nativeElement.getAttribute('aria-disabled')).toBe('true');
  });

  // ── Panel content ─────────────────────────
  it('should render content inside the active panel', () => {
    const activePanel = fixture.debugElement.queryAll(By.css('[role="tabpanel"]'))[0];
    expect(activePanel.nativeElement.textContent).toContain('Panel 1 content');
  });
});
