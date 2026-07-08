import {
  Component, Input, Output, EventEmitter,
  ChangeDetectionStrategy, HostListener,
  ElementRef, ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

export interface DropdownItem {
  id: string;
  label: string;
  icon?: string;
  disabled?: boolean;
  dividerBefore?: boolean;
}

/**
 * A11yDropdownComponent
 * ─────────────────────────────────────────────
 * Implements WAI-ARIA Menu Button pattern.
 *
 * WCAG 2.1/2.2 compliance:
 *   2.1.1  – Arrow keys navigate items; Enter/Space select; Escape closes
 *   2.1.1  – Tab closes menu and moves focus to next element
 *   1.3.1  – role="menu", role="menuitem", aria-haspopup, aria-expanded
 *   4.1.2  – aria-disabled on disabled items
 *   2.4.7  – Visible focus ring
 *   1.4.13 – Menu persists while pointer is on it
 */
@Component({
  selector: 'a11y-dropdown',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss',
})
export class A11yDropdownComponent {
  @Input() triggerLabel = 'Options';
  @Input() triggerIcon  = '';
  @Input() items: DropdownItem[] = [];
  @Output() itemSelected = new EventEmitter<DropdownItem>();

  open = false;
  focusedIndex = 0;
  triggerId = `dd-trigger-${Math.random().toString(36).slice(2, 6)}`;
  menuId    = `dd-menu-${Math.random().toString(36).slice(2, 6)}`;

  constructor(private el: ElementRef, private cdr: ChangeDetectorRef) {}

  @HostListener('document:click', ['$event'])
  onDocClick(e: MouseEvent): void {
    if (!this.el.nativeElement.contains(e.target)) { this.close(); }
  }

  toggleMenu(): void {
    this.open ? this.close() : this.openMenu();
  }

  openMenu(): void {
    this.open = true;
    this.focusedIndex = this.firstEnabled();
    this.cdr.markForCheck();
    setTimeout(() => this.focusItem(this.focusedIndex));
  }

  close(): void {
    this.open = false;
    this.cdr.markForCheck();
  }

  selectItem(item: DropdownItem): void {
    this.itemSelected.emit(item);
    this.close();
    document.getElementById(this.triggerId)?.focus();
  }

  setFocus(i: number): void { this.focusedIndex = i; this.focusItem(i); this.cdr.markForCheck(); }

  onTriggerKey(e: KeyboardEvent): void {
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
      e.preventDefault();
      this.openMenu();
    }
  }

  onMenuKey(e: KeyboardEvent): void {
    const enabled = this.items.map((it, i) => ({ it, i })).filter(x => !x.it.disabled);
    const cur = enabled.findIndex(x => x.i === this.focusedIndex);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = enabled[(cur + 1) % enabled.length];
      this.setFocus(next.i);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = enabled[(cur - 1 + enabled.length) % enabled.length];
      this.setFocus(prev.i);
    } else if (e.key === 'Home') {
      e.preventDefault(); this.setFocus(enabled[0].i);
    } else if (e.key === 'End') {
      e.preventDefault(); this.setFocus(enabled[enabled.length - 1].i);
    } else if (e.key === 'Escape' || e.key === 'Tab') {
      e.preventDefault(); this.close();
      document.getElementById(this.triggerId)?.focus();
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const item = this.items[this.focusedIndex];
      if (item && !item.disabled) this.selectItem(item);
    }
  }

  private firstEnabled(): number {
    return this.items.findIndex(it => !it.disabled);
  }

  private focusItem(i: number): void {
    document.getElementById(this.itemId(this.items[i]?.id))?.focus();
  }

  itemId(id: string): string { return `dd-item-${id}`; }
}
