import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

// All components imported via the tsconfig path alias "accessibility-lib"
import {
  A11yButtonComponent,
  A11yInputComponent,
  A11yModalComponent,
  A11yTableComponent,
  A11yTabsComponent,
  A11yTabDirective,
  A11yAccordionComponent,
  A11yDropdownComponent,
  A11yToastContainerComponent,
  A11yToastService,
  A11yAnnouncerService,
  SelectOption,
  TableColumn,
  AccordionItem,
  DropdownItem,
} from 'accessibility-lib';

import { TranslationService } from './i18n/translation.service';
import { TranslatePipe } from './i18n/translate.pipe';
import { LanguageSwitcherComponent } from './language-switcher/language-switcher.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatIconModule, TranslatePipe,
    A11yButtonComponent, A11yInputComponent, A11yModalComponent,
    A11yTableComponent, A11yTabsComponent, A11yTabDirective,
    A11yAccordionComponent, A11yDropdownComponent, A11yToastContainerComponent,
    LanguageSwitcherComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private i18n = inject(TranslationService);

  // ── 01 Button ───────────────────────────────────────────
  btnLoading = false;

  simulateLoad(): void {
    this.btnLoading = true;
    setTimeout(() => (this.btnLoading = false), 2000);
  }

  // ── 02 Input / Form ─────────────────────────────────────
  form = new FormGroup({
    name:     new FormControl('', [Validators.required, Validators.minLength(2)]),
    email:    new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    role:     new FormControl('', Validators.required),
    bio:      new FormControl(''),
  });
  formOk = false;

  roleOptions = computed<SelectOption[]>(() => {
    const t = this.tFn();
    return [
      { value: 'engineer', label: t('demo.input.role.options.engineer') },
      { value: 'designer', label: t('demo.input.role.options.designer') },
      { value: 'pm',       label: t('demo.input.role.options.pm') },
      { value: 'qa',       label: t('demo.input.role.options.qa') },
      { value: 'devrel',   label: t('demo.input.role.options.devrel') },
    ];
  });

  err(field: string): string {
    const ctrl = this.form.get(field);
    if (!ctrl?.invalid || !ctrl.touched) return '';
    if (ctrl.hasError('required'))  return this.i18n.t('demo.input.errors.required', { field: this.fieldLabel(field) });
    if (ctrl.hasError('email'))     return this.i18n.t('demo.input.errors.email');
    if (ctrl.hasError('minlength')) return this.i18n.t('demo.input.errors.minlength', { length: ctrl.getError('minlength').requiredLength });
    return this.i18n.t('demo.input.errors.invalid');
  }

  fieldLabel(f: string): string {
    const key = `demo.input.fieldLabels.${f}`;
    const resolved = this.i18n.t(key);
    return resolved === key ? f : resolved;
  }

  submitForm(): void {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.formOk = true;
      this.toast.success(this.i18n.t('demo.input.formSuccess'));
      setTimeout(() => (this.formOk = false), 4000);
    } else {
      this.announcer.announceAssertive(this.i18n.t('demo.input.errors.formHasErrors'));
      this.toast.error(this.i18n.t('demo.input.errors.fixFormErrors'));
    }
  }

  // ── 03 Modal ────────────────────────────────────────────
  modal: string | null = null;
  openModal(name: string): void { this.modal = name; }
  handleConfirm(): void {
    this.modal = null;
    this.toast.success(this.i18n.t('demo.modals.confirmDelete.deletedToast'));
  }

  // ── Library i18n label functions (shared across table instance) ──
  dismissLabelFn = (message: string) => this.i18n.t('library.toast.dismissAriaLabel', { message });
  selectRowLabelFn = (row: number) => this.i18n.t('library.table.selectRowAriaLabel', { row });
  scrollableLabelFn = (label: string) => this.i18n.t('library.table.scrollableAriaLabel', { label });
  sortAscendingLabelFn = (column: string) => this.i18n.t('library.table.sortAscending', { column });
  sortDescendingLabelFn = (column: string) => this.i18n.t('library.table.sortDescending', { column });
  selectionCountLabelFn = (count: number) => this.i18n.tPlural('library.table.rowsSelected', count);

  // ── 04 Table ────────────────────────────────────────────
  tableColumns = computed<TableColumn[]>(() => {
    const t = this.tFn();
    return [
      { key: 'name',       label: t('demo.table.columns.name'),       sortable: true },
      { key: 'role',       label: t('demo.table.columns.role'),       sortable: true },
      { key: 'department', label: t('demo.table.columns.department'), sortable: true },
      { key: 'status',     label: t('demo.table.columns.status'),     type: 'badge' },
      { key: 'joined',     label: t('demo.table.columns.joined'),     type: 'date', sortable: true },
    ];
  });

  tableData = computed(() => {
    const t = this.tFn();
    return [
      { id: 1, name: 'Priya Sharma',     role: t('demo.table.roles.leadEngineer'),    department: t('demo.table.departments.platform'),  status: t('demo.table.statuses.active'),   joined: '2021-03-15' },
      { id: 2, name: 'Carlos Mendez',    role: t('demo.table.roles.uxDesigner'),      department: t('demo.table.departments.design'),    status: t('demo.table.statuses.active'),   joined: '2022-07-01' },
      { id: 3, name: 'Aisha Johnson',    role: t('demo.table.roles.productManager'),  department: t('demo.table.departments.product'),   status: t('demo.table.statuses.active'),   joined: '2020-11-20' },
      { id: 4, name: 'Wei Zhang',        role: t('demo.table.roles.backendEngineer'), department: t('demo.table.departments.platform'),  status: t('demo.table.statuses.pending'),  joined: '2023-01-10' },
      { id: 5, name: 'Fatima Al-Rashid', role: t('demo.table.roles.qaEngineer'),      department: t('demo.table.departments.quality'),   status: t('demo.table.statuses.active'),   joined: '2022-04-05' },
      { id: 6, name: 'Luca Rossi',       role: t('demo.table.roles.devrelEngineer'),  department: t('demo.table.departments.community'), status: t('demo.table.statuses.inactive'), joined: '2021-09-28' },
    ];
  });

  onSort(e: { column: string; direction: string }): void {
    const dir = e.direction === 'asc' ? this.i18n.t('demo.table.ascending') : this.i18n.t('demo.table.descending');
    this.announcer.announce(this.i18n.t('demo.table.sortedAnnouncement', { column: e.column, direction: dir }));
  }

  onSelect(rows: Record<string,unknown>[]): void {
    if (rows.length) this.announcer.announce(this.i18n.tPlural('demo.table.rowsSelectedAnnouncement', rows.length));
  }

  // ── 06 Accordion ────────────────────────────────────────
  accordionItems = computed<AccordionItem[]>(() => {
    const t = this.tFn();
    return [
      { id: 'a1', icon: 'verified',           title: t('demo.accordion.items.wcag.title'),         content: t('demo.accordion.items.wcag.content') },
      { id: 'a2', icon: 'keyboard',           title: t('demo.accordion.items.keyboard.title'),      content: t('demo.accordion.items.keyboard.content') },
      { id: 'a3', icon: 'record_voice_over',  title: t('demo.accordion.items.screenReader.title'),  content: t('demo.accordion.items.screenReader.content') },
      { id: 'a4', icon: 'contrast',           title: t('demo.accordion.items.contrast.title'),      content: t('demo.accordion.items.contrast.content') },
    ];
  });

  // ── 07 Dropdown ─────────────────────────────────────────
  dropdownItems = computed<DropdownItem[]>(() => {
    const t = this.tFn();
    return [
      { id: 'd1', label: t('demo.dropdown.items.edit'),      icon: 'edit' },
      { id: 'd2', label: t('demo.dropdown.items.duplicate'), icon: 'content_copy' },
      { id: 'd3', label: t('demo.dropdown.items.archive'),   icon: 'archive', dividerBefore: true },
      { id: 'd4', label: t('demo.dropdown.items.delete'),    icon: 'delete',  dividerBefore: true },
      { id: 'd5', label: t('demo.dropdown.items.restricted'), icon: 'lock', disabled: true },
    ];
  });

  exportItems = computed<DropdownItem[]>(() => {
    const t = this.tFn();
    return [
      { id: 'e1', label: t('demo.dropdown.exportItems.csv'),  icon: 'table_chart' },
      { id: 'e2', label: t('demo.dropdown.exportItems.json'), icon: 'data_object' },
      { id: 'e3', label: t('demo.dropdown.exportItems.pdf'),  icon: 'picture_as_pdf' },
    ];
  });

  onDropdownSelect(item: DropdownItem): void {
    this.toast.info(this.i18n.t('demo.dropdown.selectedToast', { label: item.label }));
  }

  // ── 08 Toast ────────────────────────────────────────────
  showToast(type: 'success' | 'error' | 'warning' | 'info'): void {
    const message = this.i18n.t(`demo.toast.messages.${type}`);
    this.toast.push({ type, message, duration: type === 'error' ? 0 : 4000 });
  }

  notify(msg: string): void { this.toast.info(msg); }

  /** Returns a translate function bound to the current language, and re-runs
   *  whenever the language signal changes (used inside computed() blocks). */
  private tFn(): (key: string, params?: Record<string, string | number>) => string {
    this.i18n.lang();
    return (key, params) => this.i18n.t(key, params);
  }

  constructor(
    private toast: A11yToastService,
    private announcer: A11yAnnouncerService,
  ) {}
}
