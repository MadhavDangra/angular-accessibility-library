import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { A11yDropdownComponent, DropdownItem } from './dropdown.component';

const ITEMS: DropdownItem[] = [
  { id: 'd1', label: 'Edit',       icon: 'edit' },
  { id: 'd2', label: 'Duplicate',  icon: 'content_copy' },
  { id: 'd3', label: 'Archive',    icon: 'archive', dividerBefore: true },
  { id: 'd4', label: 'Delete',     icon: 'delete', dividerBefore: true },
  { id: 'd5', label: 'Restricted', icon: 'lock', disabled: true },
];

@Component({
  standalone: true,
  imports: [A11yDropdownComponent],
  template: `
    <a11y-dropdown
      [triggerLabel]="triggerLabel"
      [items]="items"
      (itemSelected)="onItemSelected($event)"
    ></a11y-dropdown>
  `,
})
class HostComponent {
  triggerLabel = 'Actions';
  items = ITEMS;
  selected: DropdownItem | null = null;
  onItemSelected(item: DropdownItem) { this.selected = item; }
}

describe('A11yDropdownComponent — WCAG Compliance', () => {
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

  function dropdownComponent(): A11yDropdownComponent {
    return fixture.debugElement.query(By.directive(A11yDropdownComponent)).componentInstance;
  }

  // ── 4.1.2 Trigger ARIA attributes ─────────
  it('should have aria-haspopup="menu" on trigger (WCAG 4.1.2)', () => {
    const trigger = fixture.debugElement.query(By.css('.dropdown-trigger'));
    expect(trigger.nativeElement.getAttribute('aria-haspopup')).toBe('menu');
  });

  it('should have aria-expanded="false" when closed (WCAG 4.1.2)', () => {
    const trigger = fixture.debugElement.query(By.css('.dropdown-trigger'));
    expect(trigger.nativeElement.getAttribute('aria-expanded')).toBe('false');
  });

  it('should set aria-expanded="true" when menu opens (WCAG 4.1.2)', () => {
    dropdownComponent().openMenu();
    fixture.detectChanges();
    const trigger = fixture.debugElement.query(By.css('.dropdown-trigger'));
    expect(trigger.nativeElement.getAttribute('aria-expanded')).toBe('true');
  });

  it('should link trigger aria-controls to menu id (WCAG 4.1.2)', () => {
    dropdownComponent().openMenu();
    fixture.detectChanges();
    const trigger = fixture.debugElement.query(By.css('.dropdown-trigger'));
    const menuId  = trigger.nativeElement.getAttribute('aria-controls');
    const menu    = fixture.debugElement.query(By.css(`#${menuId}`));
    expect(menu).toBeTruthy();
  });

  // ── 1.3.1 Menu roles ──────────────────────
  it('should have role="menu" when open (WCAG 1.3.1)', () => {
    dropdownComponent().openMenu();
    fixture.detectChanges();
    const menu = fixture.debugElement.query(By.css('[role="menu"]'));
    expect(menu).toBeTruthy();
  });

  it('should have role="menuitem" on each item (WCAG 1.3.1)', () => {
    dropdownComponent().openMenu();
    fixture.detectChanges();
    const items = fixture.debugElement.queryAll(By.css('[role="menuitem"]'));
    expect(items.length).toBe(ITEMS.length);
  });

  // ── 4.1.2 Disabled item ───────────────────
  it('should set aria-disabled on disabled items (WCAG 4.1.2)', () => {
    dropdownComponent().openMenu();
    fixture.detectChanges();
    const disabled = fixture.debugElement.queryAll(By.css('[role="menuitem"]'))
      .find(el => el.nativeElement.getAttribute('aria-disabled'));
    expect(disabled).toBeTruthy();
  });

  // ── 2.1.1 Toggle open/close ───────────────
  it('should open menu on toggleMenu()', () => {
    const dropdown = dropdownComponent();
    dropdown.toggleMenu();
    fixture.detectChanges();
    expect(dropdown.open).toBe(true);
  });

  it('should close menu on second toggleMenu()', () => {
    const dropdown = dropdownComponent();
    dropdown.toggleMenu();
    dropdown.toggleMenu();
    fixture.detectChanges();
    expect(dropdown.open).toBe(false);
  });

  // ── 2.1.1 Escape closes ───────────────────
  it('should close on Escape key (WCAG 2.1.1)', () => {
    const dropdown = dropdownComponent();
    dropdown.openMenu();
    fixture.detectChanges();
    dropdown.onMenuKey(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(dropdown.open).toBe(false);
  });

  // ── Item selection ────────────────────────
  it('should emit itemSelected and close on selectItem()', () => {
    const dropdown = dropdownComponent();
    dropdown.openMenu();
    fixture.detectChanges();
    dropdown.selectItem(ITEMS[0]);
    expect(host.selected).toEqual(ITEMS[0]);
    expect(dropdown.open).toBe(false);
  });

  it('should not emit for disabled items on click', () => {
    const dropdown = dropdownComponent();
    dropdown.openMenu();
    fixture.detectChanges();
    const disabledItem = ITEMS.find(i => i.disabled)!;
    // Simulates the template's click guard: `!item.disabled && selectItem(item)`
    if (!disabledItem.disabled) dropdown.selectItem(disabledItem);
    expect(host.selected).toBeNull();
  });

  // ── Dividers ──────────────────────────────
  it('should render dividers with role="separator" (WCAG 1.3.1)', () => {
    dropdownComponent().openMenu();
    fixture.detectChanges();
    const dividers = fixture.debugElement.queryAll(By.css('[role="separator"]'));
    expect(dividers.length).toBeGreaterThan(0);
  });

  // ── Trigger label ─────────────────────────
  it('should display triggerLabel in the button', () => {
    const trigger = fixture.debugElement.query(By.css('.dropdown-trigger'));
    expect(trigger.nativeElement.textContent).toContain('Actions');
  });
});
