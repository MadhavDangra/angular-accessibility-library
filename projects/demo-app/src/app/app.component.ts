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
  template: `
    <!-- Skip nav — WCAG 2.4.1 -->
    <a href="#main" class="skip-link">{{ 'common.skipToMain' | translate }}</a>

    <!-- Toast container — place once at root -->
    <a11y-toast-container
      [regionAriaLabel]="'library.toast.regionAriaLabel' | translate"
      [dismissLabelFn]="dismissLabelFn"
    ></a11y-toast-container>

    <main id="main" class="demo-page" tabindex="-1">

      <!-- ═══ HERO ═══════════════════════════════════════ -->
      <header class="demo-hero">
        <div class="lang-switcher-row">
          <app-language-switcher></app-language-switcher>
        </div>
        <h1>{{ 'demo.hero.titlePrefix' | translate }} <em>{{ 'demo.hero.titleEmphasis' | translate }}</em><br>{{ 'demo.hero.titleSuffix' | translate }}</h1>
        <p>{{ 'demo.hero.subtitle' | translate }}</p>
        <div class="badge-row" role="list" [attr.aria-label]="'demo.hero.badgeRowAriaLabel' | translate">
          <span class="badge" role="listitem"><mat-icon>verified</mat-icon>{{ 'demo.hero.badges.wcag21' | translate }}</span>
          <span class="badge" role="listitem"><mat-icon>verified</mat-icon>{{ 'demo.hero.badges.wcag22' | translate }}</span>
          <span class="badge" role="listitem"><mat-icon>keyboard</mat-icon>{{ 'demo.hero.badges.keyboardNav' | translate }}</span>
          <span class="badge" role="listitem"><mat-icon>record_voice_over</mat-icon>{{ 'demo.hero.badges.screenReader' | translate }}</span>
          <span class="badge" role="listitem"><mat-icon>touch_app</mat-icon>{{ 'demo.hero.badges.touchTargets' | translate }}</span>
          <span class="badge" role="listitem"><mat-icon>contrast</mat-icon>{{ 'demo.hero.badges.contrast' | translate }}</span>
          <span class="badge" role="listitem"><mat-icon>animation</mat-icon>{{ 'demo.hero.badges.reducedMotion' | translate }}</span>
        </div>
      </header>

      <!-- ═══ 01 · BUTTON ════════════════════════════════ -->
      <section class="section-card" aria-labelledby="s-btn">
        <p class="section-label"><mat-icon>smart_button</mat-icon>{{ 'demo.button.componentLabel' | translate }}</p>
        <h2 id="s-btn" class="section-title">{{ 'demo.button.title' | translate }}</h2>
        <p class="section-desc">
          5 variants, 3 sizes, loading and disabled states — all with
          <code>aria-busy</code>, <code>aria-disabled</code>, and 44 px touch targets.
        </p>

        <p class="subsection-title">{{ 'demo.button.variantsSubtitle' | translate }}</p>
        <div class="demo-row">
          <a11y-button variant="primary"   leftIcon="rocket_launch" (clicked)="notify('primary clicked')">{{ 'demo.button.primary' | translate }}</a11y-button>
          <a11y-button variant="secondary" leftIcon="edit"          (clicked)="notify('secondary clicked')">{{ 'demo.button.secondary' | translate }}</a11y-button>
          <a11y-button variant="danger"    leftIcon="delete"        (clicked)="notify('danger clicked')">{{ 'demo.button.danger' | translate }}</a11y-button>
          <a11y-button variant="ghost"     leftIcon="info"          (clicked)="notify('ghost clicked')">{{ 'demo.button.ghost' | translate }}</a11y-button>
          <a11y-button variant="icon-only" [ariaLabel]="'demo.button.iconOnlyAriaLabel' | translate" (clicked)="notify('settings clicked')">
            <mat-icon>settings</mat-icon>
          </a11y-button>
        </div>

        <p class="subsection-title">{{ 'demo.button.sizesSubtitle' | translate }}</p>
        <div class="demo-row">
          <a11y-button size="sm" variant="primary">{{ 'demo.button.small' | translate }}</a11y-button>
          <a11y-button size="md" variant="primary">{{ 'demo.button.medium' | translate }}</a11y-button>
          <a11y-button size="lg" variant="primary">{{ 'demo.button.large' | translate }}</a11y-button>
        </div>

        <p class="subsection-title">{{ 'demo.button.statesSubtitle' | translate }}</p>
        <div class="demo-row">
          <a11y-button [loading]="btnLoading" variant="primary" leftIcon="cloud_upload"
            (clicked)="simulateLoad()">
            {{ (btnLoading ? 'demo.button.uploading' : 'demo.button.uploadFile') | translate }}
          </a11y-button>
          <a11y-button [disabled]="true" variant="primary">{{ 'demo.button.disabledPrimary' | translate }}</a11y-button>
          <a11y-button [disabled]="true" variant="secondary">{{ 'demo.button.disabledSecondary' | translate }}</a11y-button>
        </div>

        <div class="a11y-note">
          <mat-icon>info</mat-icon>
          <span>{{ 'demo.button.note' | translate }}</span>
        </div>
      </section>

      <!-- ═══ 02 · INPUT ═════════════════════════════════ -->
      <section class="section-card" aria-labelledby="s-input">
        <p class="section-label"><mat-icon>edit_note</mat-icon>{{ 'demo.input.componentLabel' | translate }}</p>
        <h2 id="s-input" class="section-title">{{ 'demo.input.title' | translate }}</h2>
        <p class="section-desc">
          Explicit <code>&lt;label&gt;</code>, hint text via <code>aria-describedby</code>,
          and live-region error announcements on validation failure.
        </p>

        <form [formGroup]="form" (ngSubmit)="submitForm()" novalidate>
          <div class="demo-col" style="max-width:500px">
            <a11y-input
              [label]="'demo.input.fullName.label' | translate" type="text" [placeholder]="'demo.input.fullName.placeholder' | translate"
              [required]="true" [hint]="'demo.input.fullName.hint' | translate" prefixIcon="person"
              formControlName="name" [errorMessage]="err('name')"
              [requiredIndicatorText]="'library.input.requiredIndicator' | translate"
              [showPasswordLabel]="'library.input.showPassword' | translate"
              [hidePasswordLabel]="'library.input.hidePassword' | translate">
            </a11y-input>

            <a11y-input
              [label]="'demo.input.email.label' | translate" type="email" [placeholder]="'demo.input.email.placeholder' | translate"
              [required]="true" [hint]="'demo.input.email.hint' | translate" prefixIcon="email"
              formControlName="email" [errorMessage]="err('email')"
              [requiredIndicatorText]="'library.input.requiredIndicator' | translate">
            </a11y-input>

            <a11y-input
              [label]="'demo.input.password.label' | translate" type="password" [placeholder]="'demo.input.password.placeholder' | translate"
              [required]="true" [hint]="'demo.input.password.hint' | translate"
              formControlName="password" [errorMessage]="err('password')"
              [requiredIndicatorText]="'library.input.requiredIndicator' | translate"
              [showPasswordLabel]="'library.input.showPassword' | translate"
              [hidePasswordLabel]="'library.input.hidePassword' | translate">
            </a11y-input>

            <a11y-input
              [label]="'demo.input.role.label' | translate" type="select" [required]="true"
              [options]="roleOptions()" formControlName="role"
              [errorMessage]="err('role')"
              [requiredIndicatorText]="'library.input.requiredIndicator' | translate"
              [selectPlaceholderLabel]="'library.input.selectPlaceholder' | translate">
            </a11y-input>

            <a11y-input
              [label]="'demo.input.bio.label' | translate" type="textarea" [placeholder]="'demo.input.bio.placeholder' | translate"
              [hint]="'demo.input.bio.hint' | translate" formControlName="bio">
            </a11y-input>

            <div class="demo-row" style="margin-top:.25rem">
              <a11y-button type="submit" variant="primary" leftIcon="send">{{ 'demo.input.submit' | translate }}</a11y-button>
              <a11y-button type="button" variant="ghost" (clicked)="form.reset()">{{ 'demo.input.reset' | translate }}</a11y-button>
            </div>

            <p *ngIf="formOk" role="status" aria-live="polite" class="form-success">
              <mat-icon>check_circle</mat-icon> {{ 'demo.input.formSuccess' | translate }}
            </p>
          </div>
        </form>

        <div class="a11y-note">
          <mat-icon>info</mat-icon>
          <span>{{ 'demo.input.note' | translate }}</span>
        </div>
      </section>

      <!-- ═══ 03 · MODAL ═════════════════════════════════ -->
      <section class="section-card" aria-labelledby="s-modal">
        <p class="section-label"><mat-icon>web_asset</mat-icon>{{ 'demo.modal.componentLabel' | translate }}</p>
        <h2 id="s-modal" class="section-title">{{ 'demo.modal.title' | translate }}</h2>
        <p class="section-desc">
          Focus trap, Escape-to-close, focus restoration on dismiss,
          <code>aria-modal</code>, <code>aria-labelledby</code>, <code>aria-describedby</code>.
        </p>

        <div class="demo-row">
          <a11y-button variant="primary"   leftIcon="info"       (clicked)="openModal('info')">{{ 'demo.modal.infoDialog' | translate }}</a11y-button>
          <a11y-button variant="danger"    leftIcon="warning"    (clicked)="openModal('confirm')">{{ 'demo.modal.confirmDelete' | translate }}</a11y-button>
          <a11y-button variant="secondary" leftIcon="edit"       (clicked)="openModal('form')">{{ 'demo.modal.formInModal' | translate }}</a11y-button>
          <a11y-button variant="ghost"     leftIcon="fullscreen" (clicked)="openModal('full')">{{ 'demo.modal.fullscreen' | translate }}</a11y-button>
        </div>

        <div class="a11y-note">
          <mat-icon>info</mat-icon>
          <span>{{ 'demo.modal.note' | translate }}</span>
        </div>
      </section>

      <!-- ═══ 04 · TABLE ═════════════════════════════════ -->
      <section class="section-card" aria-labelledby="s-table">
        <p class="section-label"><mat-icon>table_chart</mat-icon>{{ 'demo.table.componentLabel' | translate }}</p>
        <h2 id="s-table" class="section-title">{{ 'demo.table.title' | translate }}</h2>
        <p class="section-desc">
          <code>aria-sort</code> on sortable columns, <code>aria-selected</code> for row
          selection, <code>aria-multiselectable</code>, live status for selection count.
        </p>

        <a11y-table
          [columns]="tableColumns()" [data]="tableData()"
          [tableLabel]="'demo.table.tableLabel' | translate" [selectable]="true"
          [loadingLabel]="'library.table.loading' | translate"
          [selectAllLabel]="'library.table.selectAllAriaLabel' | translate"
          [selectRowLabelFn]="selectRowLabelFn"
          [scrollableLabelFn]="scrollableLabelFn"
          [sortAscendingLabelFn]="sortAscendingLabelFn"
          [sortDescendingLabelFn]="sortDescendingLabelFn"
          [selectionCountLabelFn]="selectionCountLabelFn"
          (sortChanged)="onSort($event)"
          (selectionChanged)="onSelect($event)">
        </a11y-table>
      </section>

      <!-- ═══ 05 · TABS ══════════════════════════════════ -->
      <section class="section-card" aria-labelledby="s-tabs">
        <p class="section-label"><mat-icon>tab</mat-icon>{{ 'demo.tabs.componentLabel' | translate }}</p>
        <h2 id="s-tabs" class="section-title">{{ 'demo.tabs.title' | translate }}</h2>
        <p class="section-desc">
          WAI-ARIA Tabs pattern — arrow keys navigate, <code>aria-selected</code>,
          <code>role="tabpanel"</code>, disabled tabs skipped.
        </p>

        <a11y-tabs [ariaLabel]="'demo.tabs.ariaLabel' | translate">
          <a11y-tab [label]="'demo.tabs.overview.label' | translate" icon="home">
            <p><strong>{{ 'demo.tabs.overview.paragraph1' | translate }}</strong></p>
            <p>{{ 'demo.tabs.overview.paragraph2' | translate }}</p>
          </a11y-tab>
          <a11y-tab [label]="'demo.tabs.keyboardShortcuts.label' | translate" icon="keyboard">
            <ul>
              <li><kbd>←</kbd> / <kbd>→</kbd> — {{ 'demo.tabs.keyboardShortcuts.item1' | translate }}</li>
              <li><kbd>Home</kbd> — {{ 'demo.tabs.keyboardShortcuts.item2Home' | translate }} &nbsp;|&nbsp; <kbd>End</kbd> — {{ 'demo.tabs.keyboardShortcuts.item2End' | translate }}</li>
              <li><kbd>Tab</kbd> — {{ 'demo.tabs.keyboardShortcuts.item3' | translate }}</li>
            </ul>
          </a11y-tab>
          <a11y-tab [label]="'demo.tabs.wcagCriteria.label' | translate" icon="verified">
            <p>{{ 'demo.tabs.wcagCriteria.paragraph' | translate }}</p>
          </a11y-tab>
          <a11y-tab [label]="'demo.tabs.disabled.label' | translate" icon="block" [disabled]="true">
            <p>{{ 'demo.tabs.disabled.paragraph' | translate }}</p>
          </a11y-tab>
        </a11y-tabs>

        <div class="a11y-note">
          <mat-icon>info</mat-icon>
          <span>{{ 'demo.tabs.note' | translate }}</span>
        </div>
      </section>

      <!-- ═══ 06 · ACCORDION ═════════════════════════════ -->
      <section class="section-card" aria-labelledby="s-acc">
        <p class="section-label"><mat-icon>expand_circle_down</mat-icon>{{ 'demo.accordion.componentLabel' | translate }}</p>
        <h2 id="s-acc" class="section-title">{{ 'demo.accordion.title' | translate }}</h2>
        <p class="section-desc">
          <code>aria-expanded</code>, <code>role="region"</code>, animated panels,
          arrow key navigation between triggers.
        </p>

        <a11y-accordion [items]="accordionItems()" [allowMultiple]="false"></a11y-accordion>

        <div class="a11y-note">
          <mat-icon>info</mat-icon>
          <span>{{ 'demo.accordion.note' | translate }}</span>
        </div>
      </section>

      <!-- ═══ 07 · DROPDOWN ══════════════════════════════ -->
      <section class="section-card" aria-labelledby="s-dd">
        <p class="section-label"><mat-icon>arrow_drop_down_circle</mat-icon>{{ 'demo.dropdown.componentLabel' | translate }}</p>
        <h2 id="s-dd" class="section-title">{{ 'demo.dropdown.title' | translate }}</h2>
        <p class="section-desc">
          WAI-ARIA Menu Button pattern — <code>role="menu"</code>,
          <code>aria-haspopup</code>, arrow key navigation, Escape-to-close.
        </p>

        <div class="demo-row">
          <a11y-dropdown
            [triggerLabel]="'demo.dropdown.actionsTrigger' | translate" triggerIcon="more_vert"
            [items]="dropdownItems()"
            (itemSelected)="onDropdownSelect($event)">
          </a11y-dropdown>

          <a11y-dropdown
            [triggerLabel]="'demo.dropdown.exportTrigger' | translate" triggerIcon="download"
            [items]="exportItems()"
            (itemSelected)="onDropdownSelect($event)">
          </a11y-dropdown>
        </div>

        <div class="a11y-note">
          <mat-icon>info</mat-icon>
          <span>{{ 'demo.dropdown.note' | translate }}</span>
        </div>
      </section>

      <!-- ═══ 08 · TOAST ═════════════════════════════════ -->
      <section class="section-card" aria-labelledby="s-toast">
        <p class="section-label"><mat-icon>notifications</mat-icon>{{ 'demo.toast.componentLabel' | translate }}</p>
        <h2 id="s-toast" class="section-title">{{ 'demo.toast.title' | translate }}</h2>
        <p class="section-desc">
          <code>role="status"</code> (polite) for info/success/warning;
          <code>role="alert"</code> (assertive) for errors.
          Error toasts are persistent and never auto-dismiss.
        </p>

        <div class="demo-row">
          <a11y-button variant="primary"   leftIcon="check_circle" (clicked)="showToast('success')">{{ 'demo.toast.success' | translate }}</a11y-button>
          <a11y-button variant="danger"    leftIcon="error"        (clicked)="showToast('error')">{{ 'demo.toast.errorPersistent' | translate }}</a11y-button>
          <a11y-button variant="ghost"     leftIcon="warning"      (clicked)="showToast('warning')">{{ 'demo.toast.warning' | translate }}</a11y-button>
          <a11y-button variant="secondary" leftIcon="info"         (clicked)="showToast('info')">{{ 'demo.toast.info' | translate }}</a11y-button>
        </div>

        <div class="a11y-note">
          <mat-icon>info</mat-icon>
          <span>{{ 'demo.toast.note' | translate }}</span>
        </div>
      </section>

    </main>

    <!-- ══ Modals ════════════════════════════════════════ -->
    <a11y-modal [open]="modal === 'info'" [title]="'demo.modals.info.title' | translate"
      icon="info" size="md" (closed)="modal = null" (confirmed)="modal = null"
      [closeAriaLabel]="'library.modal.closeAriaLabel' | translate"
      [cancelLabel]="'library.modal.cancel' | translate"
      [confirmLabel]="'library.modal.confirm' | translate">
      <p>{{ 'demo.modals.info.intro' | translate }}</p>
      <ul>
        <li><strong>{{ 'demo.modals.info.perceivable.term' | translate }}</strong> — {{ 'demo.modals.info.perceivable.desc' | translate }}</li>
        <li><strong>{{ 'demo.modals.info.operable.term' | translate }}</strong> — {{ 'demo.modals.info.operable.desc' | translate }}</li>
        <li><strong>{{ 'demo.modals.info.understandable.term' | translate }}</strong> — {{ 'demo.modals.info.understandable.desc' | translate }}</li>
        <li><strong>{{ 'demo.modals.info.robust.term' | translate }}</strong> — {{ 'demo.modals.info.robust.desc' | translate }}</li>
      </ul>
    </a11y-modal>

    <a11y-modal [open]="modal === 'confirm'" [title]="'demo.modals.confirmDelete.title' | translate"
      icon="warning" size="sm" (closed)="modal = null" (confirmed)="handleConfirm()"
      [closeAriaLabel]="'library.modal.closeAriaLabel' | translate"
      [cancelLabel]="'library.modal.cancel' | translate"
      [confirmLabel]="'library.modal.confirm' | translate">
      <p>{{ 'demo.modals.confirmDelete.body' | translate }}</p>
    </a11y-modal>

    <a11y-modal [open]="modal === 'form'" [title]="'demo.modals.formInModal.title' | translate"
      icon="edit" size="md" (closed)="modal = null" [showFooter]="false"
      [closeAriaLabel]="'library.modal.closeAriaLabel' | translate">
      <div style="display:flex;flex-direction:column;gap:1rem">
        <a11y-input [label]="'demo.modals.formInModal.displayName.label' | translate" type="text"
          [placeholder]="'demo.modals.formInModal.displayName.placeholder' | translate" [required]="true"
          [requiredIndicatorText]="'library.input.requiredIndicator' | translate"></a11y-input>
        <a11y-input [label]="'demo.modals.formInModal.jobTitle.label' | translate" type="text"
          [placeholder]="'demo.modals.formInModal.jobTitle.placeholder' | translate"></a11y-input>
        <div style="display:flex;gap:.75rem;justify-content:flex-end;margin-top:.5rem">
          <a11y-button variant="ghost"   (clicked)="modal = null">{{ 'common.cancel' | translate }}</a11y-button>
          <a11y-button variant="primary" (clicked)="modal = null">{{ 'common.save' | translate }}</a11y-button>
        </div>
      </div>
    </a11y-modal>

    <a11y-modal [open]="modal === 'full'" [title]="'demo.modals.fullscreen.title' | translate"
      size="fullscreen" (closed)="modal = null" (confirmed)="modal = null"
      [closeAriaLabel]="'library.modal.closeAriaLabel' | translate"
      [cancelLabel]="'library.modal.cancel' | translate"
      [confirmLabel]="'library.modal.confirm' | translate">
      <p>{{ 'demo.modals.fullscreen.paragraph1' | translate }}</p>
      <p style="color:var(--a11y-color-ink-muted)">
        {{ 'demo.modals.fullscreen.paragraph2' | translate }}
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
    .lang-switcher-row {
      display:flex; justify-content:flex-end; margin-bottom:1rem;
    }
    .form-success {
      display:flex; align-items:center; gap:.5rem;
      color:#166534; font-weight:600; font-size:.9rem;
      mat-icon { color:#22c55e; }
    }
  `],
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
