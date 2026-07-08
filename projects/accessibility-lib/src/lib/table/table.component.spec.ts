import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { A11yTableComponent, TableColumn } from './table.component';

const COLUMNS: TableColumn[] = [
  { key: 'name',   label: 'Name',   sortable: true },
  { key: 'status', label: 'Status', type: 'badge' },
  { key: 'joined', label: 'Joined', type: 'date', sortable: true },
];

const DATA = [
  { id: 1, name: 'Priya Sharma',  status: 'Active',   joined: '2021-03-15' },
  { id: 2, name: 'Carlos Mendez', status: 'Inactive', joined: '2022-07-01' },
  { id: 3, name: 'Wei Zhang',     status: 'Pending',  joined: '2023-01-10' },
];

@Component({
  standalone: true,
  imports: [A11yTableComponent],
  template: `
    <a11y-table
      [columns]="columns"
      [data]="data"
      [tableLabel]="tableLabel"
      [selectable]="selectable"
      [loading]="loading"
      (sortChanged)="onSortChanged($event)"
      (selectionChanged)="onSelectionChanged($event)"
    ></a11y-table>
  `,
})
class HostComponent {
  columns = COLUMNS;
  data: Record<string, any>[] = DATA;
  tableLabel = 'Team members';
  selectable = false;
  loading = false;
  lastSort: any = null;
  lastSelection: any = null;
  onSortChanged(e: any) { this.lastSort = e; }
  onSelectionChanged(e: any) { this.lastSelection = e; }
}

describe('A11yTableComponent — WCAG Compliance', () => {
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

  function tableComponent(): A11yTableComponent {
    return fixture.debugElement.query(By.directive(A11yTableComponent)).componentInstance;
  }

  // ── 1.3.1 Semantics ───────────────────────
  it('should have role="grid" (WCAG 1.3.1)', () => {
    const table = fixture.debugElement.query(By.css('[role="grid"]'));
    expect(table).toBeTruthy();
  });

  it('should have aria-label on the table (WCAG 1.3.1)', () => {
    const table = fixture.debugElement.query(By.css('[role="grid"]'));
    expect(table.nativeElement.getAttribute('aria-label')).toBe('Team members');
  });

  it('should render a sr-only <caption> (WCAG 1.3.1)', () => {
    const caption = fixture.debugElement.query(By.css('caption'));
    expect(caption).toBeTruthy();
    expect(caption.nativeElement.className).toContain('sr-only');
  });

  it('should set scope="col" on all column headers', () => {
    const headers = fixture.debugElement.queryAll(By.css('th[scope="col"]'));
    expect(headers.length).toBe(COLUMNS.length);
  });

  // ── 1.3.1 aria-sort ───────────────────────
  it('should set aria-sort="none" on sortable columns initially (WCAG 1.3.1)', () => {
    const sortableTh = fixture.debugElement.query(By.css('th[aria-sort]'));
    expect(sortableTh.nativeElement.getAttribute('aria-sort')).toBe('none');
  });

  it('should update aria-sort to "ascending" after first sort click (WCAG 1.3.1)', () => {
    tableComponent().onSort('name');
    fixture.detectChanges();
    const nameTh = fixture.debugElement.queryAll(By.css('th[aria-sort]'))
      .find(el => el.query(By.css('button'))?.nativeElement.textContent.includes('Name'));
    expect(nameTh?.nativeElement.getAttribute('aria-sort')).toBe('ascending');
  });

  it('should toggle aria-sort to "descending" on second sort click', () => {
    const table = tableComponent();
    table.onSort('name');
    table.onSort('name');
    fixture.detectChanges();
    const nameTh = fixture.debugElement.queryAll(By.css('th[aria-sort]'))
      .find(el => el.query(By.css('button'))?.nativeElement.textContent.includes('Name'));
    expect(nameTh?.nativeElement.getAttribute('aria-sort')).toBe('descending');
  });

  // ── 1.3.1 Row selection ───────────────────
  it('should set aria-multiselectable when selectable=true (WCAG 1.3.1)', () => {
    host.selectable = true;
    fixture.detectChanges();
    const grid = fixture.debugElement.query(By.css('[role="grid"]'));
    expect(grid.nativeElement.getAttribute('aria-multiselectable')).toBe('true');
  });

  it('should set aria-selected on rows when selectable (WCAG 1.3.1)', () => {
    host.selectable = true;
    fixture.detectChanges();
    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    rows.forEach(row => {
      expect(row.nativeElement.getAttribute('aria-selected')).toBeDefined();
    });
  });

  it('should emit selectionChanged with correct rows on toggleRow', () => {
    host.selectable = true;
    fixture.detectChanges();
    tableComponent().toggleRow(DATA[0]);
    expect(host.lastSelection).toEqual([DATA[0]]);
  });

  it('should select all rows on toggleAll when none selected', () => {
    host.selectable = true;
    fixture.detectChanges();
    const table = tableComponent();
    table.toggleAll();
    expect(table.selectedRows.size).toBe(DATA.length);
  });

  it('should deselect all rows on toggleAll when all selected', () => {
    host.selectable = true;
    fixture.detectChanges();
    const table = tableComponent();
    table.toggleAll(); // select all
    table.toggleAll(); // deselect all
    expect(table.selectedRows.size).toBe(0);
  });

  // ── 4.1.3 Loading state ───────────────────
  it('should set aria-busy on wrapper when loading=true (WCAG 4.1.3)', () => {
    host.loading = true;
    fixture.detectChanges();
    const wrap = fixture.debugElement.query(By.css('.table-wrap'));
    expect(wrap.nativeElement.getAttribute('aria-busy')).toBe('true');
  });

  it('should show loading overlay with role="status" (WCAG 4.1.3)', () => {
    host.loading = true;
    fixture.detectChanges();
    const status = fixture.debugElement.query(By.css('[role="status"]'));
    expect(status).toBeTruthy();
  });

  // ── Empty state ───────────────────────────
  it('should show empty state row when data is empty', () => {
    host.data = [];
    fixture.detectChanges();
    const emptyState = fixture.debugElement.query(By.css('.empty-state'));
    expect(emptyState).toBeTruthy();
  });

  // ── Sort output ───────────────────────────
  it('should emit sortChanged with column and direction', () => {
    tableComponent().onSort('name');
    expect(host.lastSort).toEqual({ column: 'name', direction: 'asc' });
  });

  // ── Sort logic ────────────────────────────
  it('should sort data ascending by name', () => {
    const table = tableComponent();
    table.onSort('name');
    const sorted = table.sortedData.map(r => r['name']);
    expect(sorted).toEqual([...sorted].sort());
  });

  it('should sort data descending on second click', () => {
    const table = tableComponent();
    table.onSort('name');
    table.onSort('name');
    const sorted = table.sortedData.map(r => r['name']);
    expect(sorted).toEqual([...sorted].sort().reverse());
  });
});
