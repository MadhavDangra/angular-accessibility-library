import {
  Component, Input, Output, EventEmitter,
  ChangeDetectionStrategy, ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { trigger, state, style, animate, transition } from '@angular/animations';

export interface AccordionItem {
  id: string;
  title: string;
  content: string;
  icon?: string;
  disabled?: boolean;
}

/**
 * A11yAccordionComponent
 * ─────────────────────────────────────────────
 * WCAG 2.1/2.2 compliance:
 *   2.1.1  – Keyboard: Enter/Space toggle; arrow key navigation
 *   1.3.1  – role="region" on panels, aria-labelledby
 *   4.1.2  – aria-expanded on trigger buttons
 *   2.4.7  – Visible focus ring
 *   2.4.6  – Descriptive headings for each panel
 *   1.4.13 – Content on hover not required (keyboard sufficient)
 */
@Component({
  selector: 'a11y-accordion',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('slideDown', [
      state('open',   style({ height: '*',   opacity: 1 })),
      state('closed', style({ height: '0px', opacity: 0 })),
      transition('closed <=> open', animate('200ms cubic-bezier(.4,0,.2,1)')),
    ]),
  ],
  templateUrl: './accordion.component.html',
  styleUrl: './accordion.component.scss',
})
export class A11yAccordionComponent {
  @Input() items: AccordionItem[] = [];
  @Input() allowMultiple = false;
  @Input() openIds: string[] = [];
  @Output() toggled = new EventEmitter<string[]>();

  constructor(private cdr: ChangeDetectorRef) {}

  isOpen(id: string): boolean { return this.openIds.includes(id); }

  toggle(id: string): void {
    if (this.allowMultiple) {
      this.openIds = this.isOpen(id)
        ? this.openIds.filter(x => x !== id)
        : [...this.openIds, id];
    } else {
      this.openIds = this.isOpen(id) ? [] : [id];
    }
    this.toggled.emit(this.openIds);
    this.cdr.markForCheck();
  }

  onKeydown(event: KeyboardEvent, i: number): void {
    const triggers = this.items.filter(it => !it.disabled);
    const idx = triggers.findIndex(it => it === this.items[i]);
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      const next = triggers[(idx + 1) % triggers.length];
      this.focusTrigger(next?.id);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      const prev = triggers[(idx - 1 + triggers.length) % triggers.length];
      this.focusTrigger(prev?.id);
    } else if (event.key === 'Home') {
      event.preventDefault(); this.focusTrigger(triggers[0]?.id);
    } else if (event.key === 'End') {
      event.preventDefault(); this.focusTrigger(triggers[triggers.length - 1]?.id);
    }
  }

  private focusTrigger(id?: string): void {
    if (!id) return;
    document.getElementById(this.triggerId(id))?.focus();
  }

  triggerId(id: string): string { return `accordion-trigger-${id}`; }
  panelId(id: string):   string { return `accordion-panel-${id}`; }
}
