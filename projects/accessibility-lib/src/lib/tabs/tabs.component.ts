import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ContentChildren,
  QueryList,
  AfterContentInit,
  ChangeDetectorRef,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

/**
 * A11yTabDirective
 *
 * Wraps its content in a named <ng-template #tabContent> and exposes it
 * via a @ViewChild so the parent can render it with *ngTemplateOutlet.
 * This avoids injecting TemplateRef directly in the constructor (which
 * only works on structural directives applied to <ng-template> elements).
 */
@Component({
  selector: 'a11y-tab',
  standalone: true,
  template: `
    <ng-template #tabContent>
      <ng-content></ng-content>
    </ng-template>
  `,
})
export class A11yTabDirective {
  @Input() label    = '';
  @Input() icon     = '';
  @Input() disabled = false;

  @ViewChild('tabContent', { static: true }) content!: TemplateRef<unknown>;
}

/**
 * A11yTabsComponent
 * ─────────────────────────────────────────────────────────────
 * WCAG 2.1/2.2 compliance:
 *   2.1.1  – Arrow keys navigate tabs (WAI-ARIA Tabs pattern); Home/End
 *   1.3.1  – role="tablist", role="tab", role="tabpanel"
 *   4.1.2  – aria-selected, aria-controls, aria-labelledby, aria-disabled
 *   2.4.7  – Visible 3px focus ring on all tab buttons
 *   1.4.3  – Active tab colour contrast ≥ 4.5:1
 */
@Component({
  selector: 'a11y-tabs',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
})
export class A11yTabsComponent implements AfterContentInit {
  @Input() ariaLabel   = 'Tabs';
  @Input() activeIndex = 0;
  @Output() tabChanged = new EventEmitter<number>();

  @ContentChildren(A11yTabDirective) private _tabs!: QueryList<A11yTabDirective>;
  tabList: A11yTabDirective[] = [];

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterContentInit(): void {
    this.tabList = this._tabs.toArray();
    this._tabs.changes.subscribe(() => {
      this.tabList = this._tabs.toArray();
      this.cdr.markForCheck();
    });
    this.cdr.markForCheck();
  }

  select(i: number): void {
    this.activeIndex = i;
    this.tabChanged.emit(i);
    this.cdr.markForCheck();
  }

  onKeydown(event: KeyboardEvent, i: number): void {
    const total = this.tabList.length;
    let next = i;
    if      (event.key === 'ArrowRight') next = (i + 1) % total;
    else if (event.key === 'ArrowLeft')  next = (i - 1 + total) % total;
    else if (event.key === 'Home')       next = 0;
    else if (event.key === 'End')        next = total - 1;
    else return;

    event.preventDefault();
    let attempts = 0;
    while (this.tabList[next]?.disabled && attempts < total) {
      next = event.key === 'ArrowLeft'
        ? (next - 1 + total) % total
        : (next + 1) % total;
      attempts++;
    }
    this.select(next);
    setTimeout(() => {
      (document.querySelectorAll<HTMLElement>('[role="tab"]')[next])?.focus();
    });
  }

  tabId(i: number):   string { return `a11y-tab-${i}`; }
  panelId(i: number): string { return `a11y-panel-${i}`; }
}
