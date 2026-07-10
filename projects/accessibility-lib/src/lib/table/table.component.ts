import {
  Component, Input, Output, EventEmitter,
  ChangeDetectionStrategy, ChangeDetectorRef, TrackByFunction,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  type?: 'text' | 'badge' | 'date' | 'number';
}

export interface SortEvent { column: string; direction: 'asc' | 'desc'; }

/**
 * A11yTableComponent
 * ─────────────────────────────────────────────
 * WCAG 2.1/2.2 compliance:
 *   1.3.1  – role="grid", aria-labelledby, <caption>, scope attributes
 *   2.1.1  – Full keyboard navigation (arrows, Home/End)
 *   2.4.7  – Visible focus ring on rows and sort buttons
 *   1.3.1  – aria-sort on sortable column headers
 *   1.3.1  – aria-selected, aria-multiselectable for row selection
 *   4.1.3  – Live region for loading/empty/selection count
 */
@Component({
  selector: 'a11y-table',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatCheckboxModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class A11yTableComponent {
  @Input() columns: TableColumn[] = [];
  @Input() data: Record<string, any>[] = [];
  @Input() tableLabel = 'Data table';
  @Input() caption = '';
  @Input() loading = false;
  @Input() selectable = false;
  @Input() emptyMessage = 'No data available.';
  @Input() rowIdKey = 'id';

  /** i18n-overridable strings — defaults preserve existing English behavior. */
  @Input() loadingLabel = 'Loading table data…';
  @Input() selectAllLabel = 'Select all rows';
  @Input() selectRowLabelFn: (row: number) => string = (row) => `Select row ${row}`;
  @Input() scrollableLabelFn: (label: string) => string = (label) => `Scrollable: ${label}`;
  @Input() sortAscendingLabelFn: (column: string) => string = (column) => `Sort by ${column}, ascending`;
  @Input() sortDescendingLabelFn: (column: string) => string = (column) => `Sort by ${column}, descending`;
  @Input() selectionCountLabelFn: (count: number) => string =
    (count) => `${count} row${count !== 1 ? 's' : ''} selected`;

  @Output() sortChanged      = new EventEmitter<SortEvent>();
  @Output() selectionChanged = new EventEmitter<Record<string, any>[]>();

  sortCol = ''; sortDir: 'asc' | 'desc' = 'asc';
  selectedRows = new Set<any>();

  constructor(private cdr: ChangeDetectorRef) {}

  get sortedData(): Record<string, any>[] {
    if (!this.sortCol) return this.data;
    return [...this.data].sort((a, b) => {
      const va = a[this.sortCol], vb = b[this.sortCol];
      const cmp = typeof va === 'number' && typeof vb === 'number'
        ? va - vb : String(va).localeCompare(String(vb));
      return this.sortDir === 'asc' ? cmp : -cmp;
    });
  }

  get allSelected(): boolean  { return this.data.length > 0 && this.selectedRows.size === this.data.length; }
  get someSelected(): boolean { return this.selectedRows.size > 0 && !this.allSelected; }
  isSelected(row: Record<string, any>): boolean { return this.selectedRows.has(row[this.rowIdKey] ?? row); }

  toggleRow(row: Record<string, any>): void {
    const key = row[this.rowIdKey] ?? row;
    this.selectedRows.has(key) ? this.selectedRows.delete(key) : this.selectedRows.add(key);
    this.selectionChanged.emit(this.data.filter(r => this.isSelected(r)));
    this.cdr.markForCheck();
  }

  toggleAll(): void {
    this.allSelected ? this.selectedRows.clear()
      : this.data.forEach(r => this.selectedRows.add(r[this.rowIdKey] ?? r));
    this.selectionChanged.emit(this.data.filter(r => this.isSelected(r)));
    this.cdr.markForCheck();
  }

  onSort(key: string): void {
    this.sortDir = this.sortCol === key ? (this.sortDir === 'asc' ? 'desc' : 'asc') : 'asc';
    this.sortCol = key;
    this.sortChanged.emit({ column: this.sortCol, direction: this.sortDir });
    this.cdr.markForCheck();
  }

  getSortAria(key: string): 'ascending' | 'descending' | 'none' {
    if (this.sortCol !== key) return 'none';
    return this.sortDir === 'asc' ? 'ascending' : 'descending';
  }

  getSortLabel(col: TableColumn): string {
    if (this.sortCol !== col.key) return this.sortAscendingLabelFn(col.label);
    return this.sortDir === 'asc'
      ? this.sortDescendingLabelFn(col.label)
      : this.sortAscendingLabelFn(col.label);
  }

  trackByKey: TrackByFunction<TableColumn> = (_, c) => c.key;
  trackByIndex: TrackByFunction<any> = (i) => i;
}
