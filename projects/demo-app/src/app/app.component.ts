import { Component } from '@angular/core';
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

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatIconModule,
    A11yButtonComponent, A11yInputComponent, A11yModalComponent,
    A11yTableComponent, A11yTabsComponent, A11yTabDirective,
    A11yAccordionComponent, A11yDropdownComponent, A11yToastContainerComponent,
  ],
  template: `
    <!-- Skip nav — WCAG 2.4.1 -->
    <a href="#main" class="skip-link">Skip to main content</a>

    <!-- Toast container — place once at root -->
    <a11y-toast-container></a11y-toast-container>

    <main id="main" class="demo-page" tabindex="-1">

      <!-- ═══ HERO ═══════════════════════════════════════ -->
      <header class="demo-hero">
        <h1>Angular <em>Accessibility</em><br>Component Library</h1>
        <p>8 WCAG 2.1/2.2 AA-compliant components — ARIA, keyboard navigation, screen reader ready.</p>
        <div class="badge-row" role="list" aria-label="Compliance features">
          <span class="badge" role="listitem"><mat-icon>verified</mat-icon>WCAG 2.1 AA</span>
          <span class="badge" role="listitem"><mat-icon>verified</mat-icon>WCAG 2.2</span>
          <span class="badge" role="listitem"><mat-icon>keyboard</mat-icon>Keyboard Nav</span>
          <span class="badge" role="listitem"><mat-icon>record_voice_over</mat-icon>Screen Reader</span>
          <span class="badge" role="listitem"><mat-icon>touch_app</mat-icon>44 px Targets</span>
          <span class="badge" role="listitem"><mat-icon>contrast</mat-icon>4.5:1 Contrast</span>
          <span class="badge" role="listitem"><mat-icon>animation</mat-icon>Reduced Motion</span>
        </div>
      </header>

      <!-- ═══ 01 · BUTTON ════════════════════════════════ -->
      <section class="section-card" aria-labelledby="s-btn">
        <p class="section-label"><mat-icon>smart_button</mat-icon>Component 01</p>
        <h2 id="s-btn" class="section-title">Button</h2>
        <p class="section-desc">
          5 variants, 3 sizes, loading and disabled states — all with
          <code>aria-busy</code>, <code>aria-disabled</code>, and 44 px touch targets.
        </p>

        <p class="subsection-title">Variants</p>
        <div class="demo-row">
          <a11y-button variant="primary"   leftIcon="rocket_launch" (clicked)="notify('primary clicked')">Primary</a11y-button>
          <a11y-button variant="secondary" leftIcon="edit"          (clicked)="notify('secondary clicked')">Secondary</a11y-button>
          <a11y-button variant="danger"    leftIcon="delete"        (clicked)="notify('danger clicked')">Danger</a11y-button>
          <a11y-button variant="ghost"     leftIcon="info"          (clicked)="notify('ghost clicked')">Ghost</a11y-button>
          <a11y-button variant="icon-only" ariaLabel="Settings"     (clicked)="notify('settings clicked')">
            <mat-icon>settings</mat-icon>
          </a11y-button>
        </div>

        <p class="subsection-title">Sizes</p>
        <div class="demo-row">
          <a11y-button size="sm" variant="primary">Small</a11y-button>
          <a11y-button size="md" variant="primary">Medium</a11y-button>
          <a11y-button size="lg" variant="primary">Large</a11y-button>
        </div>

        <p class="subsection-title">States</p>
        <div class="demo-row">
          <a11y-button [loading]="btnLoading" variant="primary" leftIcon="cloud_upload"
            (clicked)="simulateLoad()">
            {{ btnLoading ? 'Uploading…' : 'Upload File' }}
          </a11y-button>
          <a11y-button [disabled]="true" variant="primary">Disabled Primary</a11y-button>
          <a11y-button [disabled]="true" variant="secondary">Disabled Secondary</a11y-button>
        </div>

        <div class="a11y-note">
          <mat-icon>info</mat-icon>
          <span>Disabled buttons use <code>aria-disabled</code> (not the HTML <code>disabled</code>
          attribute) so they remain in the tab order and are announced by screen readers.</span>
        </div>
      </section>

      <!-- ═══ 02 · INPUT ═════════════════════════════════ -->
      <section class="section-card" aria-labelledby="s-input">
        <p class="section-label"><mat-icon>edit_note</mat-icon>Component 02</p>
        <h2 id="s-input" class="section-title">Input / Form Field</h2>
        <p class="section-desc">
          Explicit <code>&lt;label&gt;</code>, hint text via <code>aria-describedby</code>,
          and live-region error announcements on validation failure.
        </p>

        <form [formGroup]="form" (ngSubmit)="submitForm()" novalidate>
          <div class="demo-col" style="max-width:500px">
            <a11y-input
              label="Full Name" type="text" placeholder="Priya Sharma"
              [required]="true" hint="First and last name" prefixIcon="person"
              formControlName="name" [errorMessage]="err('name')">
            </a11y-input>

            <a11y-input
              label="Email Address" type="email" placeholder="you@company.com"
              [required]="true" hint="We'll never share your email" prefixIcon="email"
              formControlName="email" [errorMessage]="err('email')">
            </a11y-input>

            <a11y-input
              label="Password" type="password" placeholder="Min 8 characters"
              [required]="true" hint="Include a number and special character"
              formControlName="password" [errorMessage]="err('password')">
            </a11y-input>

            <a11y-input
              label="Role" type="select" [required]="true"
              [options]="roleOptions" formControlName="role"
              [errorMessage]="err('role')">
            </a11y-input>

            <a11y-input
              label="Bio" type="textarea" placeholder="Tell us about yourself…"
              hint="Optional — max 300 characters" formControlName="bio">
            </a11y-input>

            <div class="demo-row" style="margin-top:.25rem">
              <a11y-button type="submit" variant="primary" leftIcon="send">Submit</a11y-button>
              <a11y-button type="button" variant="ghost" (clicked)="form.reset()">Reset</a11y-button>
            </div>

            <p *ngIf="formOk" role="status" aria-live="polite" class="form-success">
              <mat-icon>check_circle</mat-icon> Form submitted successfully!
            </p>
          </div>
        </form>

        <div class="a11y-note">
          <mat-icon>info</mat-icon>
          <span>Errors use <code>role="alert"</code> + <code>aria-live="assertive"</code>
          so screen readers interrupt and announce them immediately on blur.</span>
        </div>
      </section>

      <!-- ═══ 03 · MODAL ═════════════════════════════════ -->
      <section class="section-card" aria-labelledby="s-modal">
        <p class="section-label"><mat-icon>web_asset</mat-icon>Component 03</p>
        <h2 id="s-modal" class="section-title">Modal / Dialog</h2>
        <p class="section-desc">
          Focus trap, Escape-to-close, focus restoration on dismiss,
          <code>aria-modal</code>, <code>aria-labelledby</code>, <code>aria-describedby</code>.
        </p>

        <div class="demo-row">
          <a11y-button variant="primary"   leftIcon="info"       (clicked)="openModal('info')">Info Dialog</a11y-button>
          <a11y-button variant="danger"    leftIcon="warning"    (clicked)="openModal('confirm')">Confirm Delete</a11y-button>
          <a11y-button variant="secondary" leftIcon="edit"       (clicked)="openModal('form')">Form in Modal</a11y-button>
          <a11y-button variant="ghost"     leftIcon="fullscreen" (clicked)="openModal('full')">Fullscreen</a11y-button>
        </div>

        <div class="a11y-note">
          <mat-icon>info</mat-icon>
          <span>Tab / Shift+Tab cycle only within the dialog. Focus returns to the
          triggering button on close — WCAG 2.4.3.</span>
        </div>
      </section>

      <!-- ═══ 04 · TABLE ═════════════════════════════════ -->
      <section class="section-card" aria-labelledby="s-table">
        <p class="section-label"><mat-icon>table_chart</mat-icon>Component 04</p>
        <h2 id="s-table" class="section-title">Data Table</h2>
        <p class="section-desc">
          <code>aria-sort</code> on sortable columns, <code>aria-selected</code> for row
          selection, <code>aria-multiselectable</code>, live status for selection count.
        </p>

        <a11y-table
          [columns]="tableColumns" [data]="tableData"
          tableLabel="Team members" [selectable]="true"
          (sortChanged)="onSort($event)"
          (selectionChanged)="onSelect($event)">
        </a11y-table>
      </section>

      <!-- ═══ 05 · TABS ══════════════════════════════════ -->
      <section class="section-card" aria-labelledby="s-tabs">
        <p class="section-label"><mat-icon>tab</mat-icon>Component 05</p>
        <h2 id="s-tabs" class="section-title">Tabs</h2>
        <p class="section-desc">
          WAI-ARIA Tabs pattern — arrow keys navigate, <code>aria-selected</code>,
          <code>role="tabpanel"</code>, disabled tabs skipped.
        </p>

        <a11y-tabs ariaLabel="Feature tabs">
          <a11y-tab label="Overview" icon="home">
            <p><strong>Overview panel.</strong> Press arrow keys to move between tabs.
            Press Tab to move focus into the panel content.</p>
            <p>All tab triggers use <code>role="tab"</code>, and panels use
            <code>role="tabpanel"</code> with <code>aria-labelledby</code>.</p>
          </a11y-tab>
          <a11y-tab label="Keyboard Shortcuts" icon="keyboard">
            <ul>
              <li><kbd>←</kbd> / <kbd>→</kbd> — Move between tabs</li>
              <li><kbd>Home</kbd> — First tab &nbsp;|&nbsp; <kbd>End</kbd> — Last tab</li>
              <li><kbd>Tab</kbd> — Move into panel content</li>
            </ul>
          </a11y-tab>
          <a11y-tab label="WCAG Criteria" icon="verified">
            <p>Covers <strong>2.1.1</strong> Keyboard, <strong>1.3.1</strong> Info &amp;
            Relationships, <strong>4.1.2</strong> Name/Role/Value, <strong>2.4.7</strong>
            Focus Visible.</p>
          </a11y-tab>
          <a11y-tab label="Disabled" icon="block" [disabled]="true">
            <p>This content is inaccessible because the tab is disabled.</p>
          </a11y-tab>
        </a11y-tabs>

        <div class="a11y-note">
          <mat-icon>info</mat-icon>
          <span>Disabled tabs are skipped when arrowing. Only the active tab has
          <code>tabindex="0"</code>; inactive tabs use <code>tabindex="-1"</code>.</span>
        </div>
      </section>

      <!-- ═══ 06 · ACCORDION ═════════════════════════════ -->
      <section class="section-card" aria-labelledby="s-acc">
        <p class="section-label"><mat-icon>expand_circle_down</mat-icon>Component 06</p>
        <h2 id="s-acc" class="section-title">Accordion</h2>
        <p class="section-desc">
          <code>aria-expanded</code>, <code>role="region"</code>, animated panels,
          arrow key navigation between triggers.
        </p>

        <a11y-accordion [items]="accordionItems" [allowMultiple]="false"></a11y-accordion>

        <div class="a11y-note">
          <mat-icon>info</mat-icon>
          <span>Each trigger uses <code>aria-expanded</code> + <code>aria-controls</code>.
          Panels use <code>role="region"</code> + <code>aria-labelledby</code>.
          Arrow keys move between triggers; disabled items are skipped.</span>
        </div>
      </section>

      <!-- ═══ 07 · DROPDOWN ══════════════════════════════ -->
      <section class="section-card" aria-labelledby="s-dd">
        <p class="section-label"><mat-icon>arrow_drop_down_circle</mat-icon>Component 07</p>
        <h2 id="s-dd" class="section-title">Dropdown Menu</h2>
        <p class="section-desc">
          WAI-ARIA Menu Button pattern — <code>role="menu"</code>,
          <code>aria-haspopup</code>, arrow key navigation, Escape-to-close.
        </p>

        <div class="demo-row">
          <a11y-dropdown
            triggerLabel="Actions" triggerIcon="more_vert"
            [items]="dropdownItems"
            (itemSelected)="onDropdownSelect($event)">
          </a11y-dropdown>

          <a11y-dropdown
            triggerLabel="Export" triggerIcon="download"
            [items]="exportItems"
            (itemSelected)="onDropdownSelect($event)">
          </a11y-dropdown>
        </div>

        <div class="a11y-note">
          <mat-icon>info</mat-icon>
          <span>Escape closes and returns focus to the trigger. Disabled items have
          <code>aria-disabled</code> and are skipped in keyboard navigation.</span>
        </div>
      </section>

      <!-- ═══ 08 · TOAST ═════════════════════════════════ -->
      <section class="section-card" aria-labelledby="s-toast">
        <p class="section-label"><mat-icon>notifications</mat-icon>Component 08</p>
        <h2 id="s-toast" class="section-title">Toast / Notification</h2>
        <p class="section-desc">
          <code>role="status"</code> (polite) for info/success/warning;
          <code>role="alert"</code> (assertive) for errors.
          Error toasts are persistent and never auto-dismiss.
        </p>

        <div class="demo-row">
          <a11y-button variant="primary"   leftIcon="check_circle" (clicked)="showToast('success')">Success</a11y-button>
          <a11y-button variant="danger"    leftIcon="error"        (clicked)="showToast('error')">Error (persistent)</a11y-button>
          <a11y-button variant="ghost"     leftIcon="warning"      (clicked)="showToast('warning')">Warning</a11y-button>
          <a11y-button variant="secondary" leftIcon="info"         (clicked)="showToast('info')">Info</a11y-button>
        </div>

        <div class="a11y-note">
          <mat-icon>info</mat-icon>
          <span>Error toasts persist until manually dismissed (WCAG 2.2.1). The
          close button is 44×44 px with a descriptive <code>aria-label</code>.
          Type is conveyed via icon + label — never colour alone (1.4.1).</span>
        </div>
      </section>

    </main>

    <!-- ══ Modals ════════════════════════════════════════ -->
    <a11y-modal [open]="modal === 'info'" title="Accessibility Principles"
      icon="info" size="md" (closed)="modal = null" (confirmed)="modal = null">
      <p>This library covers all four WCAG 2.1 POUR principles:</p>
      <ul>
        <li><strong>Perceivable</strong> — Alt text, contrast, text alternatives</li>
        <li><strong>Operable</strong> — Full keyboard access, no traps, focus management</li>
        <li><strong>Understandable</strong> — Clear labels, error identification, predictable UI</li>
        <li><strong>Robust</strong> — Valid HTML, ARIA, tested with real screen readers</li>
      </ul>
    </a11y-modal>

    <a11y-modal [open]="modal === 'confirm'" title="Delete Record"
      icon="warning" size="sm" (closed)="modal = null" (confirmed)="handleConfirm()">
      <p>Are you sure you want to delete this record?
      This action <strong>cannot be undone</strong>.</p>
    </a11y-modal>

    <a11y-modal [open]="modal === 'form'" title="Edit Profile"
      icon="edit" size="md" (closed)="modal = null" [showFooter]="false">
      <div style="display:flex;flex-direction:column;gap:1rem">
        <a11y-input label="Display Name" type="text"
          placeholder="Your name" [required]="true"></a11y-input>
        <a11y-input label="Job Title" type="text"
          placeholder="e.g. Frontend Engineer"></a11y-input>
        <div style="display:flex;gap:.75rem;justify-content:flex-end;margin-top:.5rem">
          <a11y-button variant="ghost"   (clicked)="modal = null">Cancel</a11y-button>
          <a11y-button variant="primary" (clicked)="modal = null">Save Changes</a11y-button>
        </div>
      </div>
    </a11y-modal>

    <a11y-modal [open]="modal === 'full'" title="Fullscreen Dialog"
      size="fullscreen" (closed)="modal = null" (confirmed)="modal = null">
      <p>Full viewport — focus is still trapped and Escape still closes.</p>
      <p style="color:var(--a11y-color-ink-muted)">
        Useful for complex workflows or onboarding flows on mobile devices.
      </p>
    </a11y-modal>
  `,
  styles: [`
    kbd {
      display:inline-block; padding:.1em .4em;
      border:1px solid var(--a11y-color-border); border-radius:4px;
      font-family:var(--a11y-font-mono); font-size:.8em; background:#f9fafb;
    }
    ul { padding-left:1.25rem; line-height:2; margin:.5rem 0; }
    .form-success {
      display:flex; align-items:center; gap:.5rem;
      color:#166534; font-weight:600; font-size:.9rem;
      mat-icon { color:#22c55e; }
    }
  `],
})
export class AppComponent {

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

  roleOptions: SelectOption[] = [
    { value: 'engineer', label: 'Software Engineer' },
    { value: 'designer', label: 'UX Designer' },
    { value: 'pm',       label: 'Product Manager' },
    { value: 'qa',       label: 'QA Engineer' },
    { value: 'devrel',   label: 'Developer Relations' },
  ];

  err(field: string): string {
    const ctrl = this.form.get(field);
    if (!ctrl?.invalid || !ctrl.touched) return '';
    if (ctrl.hasError('required'))   return `${this.fieldLabel(field)} is required.`;
    if (ctrl.hasError('email'))      return 'Enter a valid email address.';
    if (ctrl.hasError('minlength'))  return `Must be at least ${ctrl.getError('minlength').requiredLength} characters.`;
    return 'Invalid value.';
  }

  fieldLabel(f: string): string {
    return ({ name: 'Full Name', email: 'Email', password: 'Password', role: 'Role' } as Record<string,string>)[f] ?? f;
  }

  submitForm(): void {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.formOk = true;
      this.toast.success('Form submitted successfully!');
      setTimeout(() => (this.formOk = false), 4000);
    } else {
      this.announcer.announceAssertive('Form has errors. Please correct the highlighted fields.');
      this.toast.error('Please fix the form errors before submitting.');
    }
  }

  // ── 03 Modal ────────────────────────────────────────────
  modal: string | null = null;
  openModal(name: string): void { this.modal = name; }
  handleConfirm(): void {
    this.modal = null;
    this.toast.success('Record deleted.');
  }

  // ── 04 Table ────────────────────────────────────────────
  tableColumns: TableColumn[] = [
    { key: 'name',       label: 'Name',       sortable: true },
    { key: 'role',       label: 'Role',       sortable: true },
    { key: 'department', label: 'Department', sortable: true },
    { key: 'status',     label: 'Status',     type: 'badge' },
    { key: 'joined',     label: 'Joined',     type: 'date', sortable: true },
  ];

  tableData = [
    { id: 1, name: 'Priya Sharma',     role: 'Lead Engineer',    department: 'Platform',  status: 'Active',   joined: '2021-03-15' },
    { id: 2, name: 'Carlos Mendez',    role: 'UX Designer',      department: 'Design',    status: 'Active',   joined: '2022-07-01' },
    { id: 3, name: 'Aisha Johnson',    role: 'Product Manager',  department: 'Product',   status: 'Active',   joined: '2020-11-20' },
    { id: 4, name: 'Wei Zhang',        role: 'Backend Engineer', department: 'Platform',  status: 'Pending',  joined: '2023-01-10' },
    { id: 5, name: 'Fatima Al-Rashid', role: 'QA Engineer',      department: 'Quality',   status: 'Active',   joined: '2022-04-05' },
    { id: 6, name: 'Luca Rossi',       role: 'DevRel Engineer',  department: 'Community', status: 'Inactive', joined: '2021-09-28' },
  ];

  onSort(e: { column: string; direction: string }): void {
    this.announcer.announce(`Sorted by ${e.column}, ${e.direction}ending`);
  }

  onSelect(rows: Record<string,unknown>[]): void {
    if (rows.length) this.announcer.announce(`${rows.length} row${rows.length > 1 ? 's' : ''} selected`);
  }

  // ── 06 Accordion ────────────────────────────────────────
  accordionItems: AccordionItem[] = [
    {
      id: 'a1', icon: 'verified', title: 'What is WCAG?',
      content: 'The Web Content Accessibility Guidelines (WCAG) are developed by the W3C and define how to make web content more accessible to people with disabilities. WCAG 2.1 and 2.2 cover the POUR principles.',
    },
    {
      id: 'a2', icon: 'keyboard', title: 'Keyboard accessibility',
      content: 'All interactive elements must be operable via keyboard alone. Users should never be trapped in a component without a keyboard exit.',
    },
    {
      id: 'a3', icon: 'record_voice_over', title: 'Screen reader support',
      content: 'Screen readers rely on semantic HTML and ARIA attributes. Every component is tested with VoiceOver (macOS/iOS) and NVDA (Windows).',
    },
    {
      id: 'a4', icon: 'contrast', title: 'Colour contrast requirements',
      content: 'WCAG 1.4.3 requires ≥4.5:1 contrast for normal text. All tokens in this library meet or exceed this ratio.',
    },
  ];

  // ── 07 Dropdown ─────────────────────────────────────────
  dropdownItems: DropdownItem[] = [
    { id: 'd1', label: 'Edit',      icon: 'edit' },
    { id: 'd2', label: 'Duplicate', icon: 'content_copy' },
    { id: 'd3', label: 'Archive',   icon: 'archive', dividerBefore: true },
    { id: 'd4', label: 'Delete',    icon: 'delete',  dividerBefore: true },
    { id: 'd5', label: 'Restricted (disabled)', icon: 'lock', disabled: true },
  ];

  exportItems: DropdownItem[] = [
    { id: 'e1', label: 'Export as CSV',  icon: 'table_chart' },
    { id: 'e2', label: 'Export as JSON', icon: 'data_object' },
    { id: 'e3', label: 'Export as PDF',  icon: 'picture_as_pdf' },
  ];

  onDropdownSelect(item: DropdownItem): void {
    this.toast.info(`Selected: ${item.label}`);
  }

  // ── 08 Toast ────────────────────────────────────────────
  showToast(type: 'success' | 'error' | 'warning' | 'info'): void {
    const messages: Record<string, string> = {
      success: 'Changes saved successfully.',
      error:   'Something went wrong — please try again.',
      warning: 'Your session will expire in 5 minutes.',
      info:    'A new version of the app is available.',
    };
    this.toast.push({ type, message: messages[type], duration: type === 'error' ? 0 : 4000 });
  }

  notify(msg: string): void { this.toast.info(msg); }

  constructor(
    private toast: A11yToastService,
    private announcer: A11yAnnouncerService,
  ) {}
}
