import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { A11yAccordionComponent, AccordionItem } from './accordion.component';

const ITEMS: AccordionItem[] = [
  { id: 'p1', title: 'Panel 1', content: 'Content 1' },
  { id: 'p2', title: 'Panel 2', content: 'Content 2' },
  { id: 'p3', title: 'Panel 3 (disabled)', content: 'Content 3', disabled: true },
];

describe('A11yAccordionComponent — WCAG Compliance', () => {
  let fixture: ComponentFixture<A11yAccordionComponent>;
  let component: A11yAccordionComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [A11yAccordionComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(A11yAccordionComponent);
    component = fixture.componentInstance;
    component.items = ITEMS;
    fixture.detectChanges();
  });

  // ── 4.1.2 Name/Role/Value — aria-expanded ──
  it('should set aria-expanded="false" initially (WCAG 4.1.2)', () => {
    const triggers = fixture.debugElement.queryAll(By.css('.accordion-trigger'));
    triggers.forEach(t => {
      if (!t.nativeElement.disabled) {
        expect(t.nativeElement.getAttribute('aria-expanded')).toBe('false');
      }
    });
  });

  it('should set aria-expanded="true" when panel is opened (WCAG 4.1.2)', () => {
    component.toggle('p1');
    fixture.detectChanges();
    const trigger = fixture.debugElement.query(By.css('#accordion-trigger-p1'));
    expect(trigger.nativeElement.getAttribute('aria-expanded')).toBe('true');
  });

  // ── 1.3.1 Info & Relationships ─────────────
  it('should link aria-controls to panel id (WCAG 1.3.1)', () => {
    const trigger = fixture.debugElement.query(By.css('#accordion-trigger-p1'));
    expect(trigger.nativeElement.getAttribute('aria-controls')).toBe('accordion-panel-p1');
  });

  it('should give panel role="region" and aria-labelledby (WCAG 1.3.1)', () => {
    const panel = fixture.debugElement.query(By.css('#accordion-panel-p1'));
    expect(panel.nativeElement.getAttribute('role')).toBe('region');
    expect(panel.nativeElement.getAttribute('aria-labelledby')).toBe('accordion-trigger-p1');
  });

  // ── Single open mode ───────────────────────
  it('should close previously open panel in single mode', () => {
    component.toggle('p1');
    fixture.detectChanges();
    component.toggle('p2');
    fixture.detectChanges();
    expect(component.isOpen('p1')).toBe(false);
    expect(component.isOpen('p2')).toBe(true);
  });

  // ── Multiple open mode ─────────────────────
  it('should keep multiple panels open in allowMultiple mode', () => {
    component.allowMultiple = true;
    component.toggle('p1');
    component.toggle('p2');
    fixture.detectChanges();
    expect(component.isOpen('p1')).toBe(true);
    expect(component.isOpen('p2')).toBe(true);
  });

  // ── Disabled ──────────────────────────────
  it('should mark disabled triggers with aria-disabled (WCAG 4.1.2)', () => {
    const disabledTrigger = fixture.debugElement.query(By.css('#accordion-trigger-p3'));
    expect(disabledTrigger.nativeElement.getAttribute('aria-disabled')).toBeTruthy();
  });
});
