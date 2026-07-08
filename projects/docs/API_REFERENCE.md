# Component API Reference

> Import from `accessibility-lib` after adding it to your Angular workspace,
> or import directly via path alias during development.

---

## `<a11y-button>`

```html
<a11y-button
  variant="primary"
  size="md"
  [disabled]="false"
  [loading]="false"
  leftIcon="save"
  rightIcon=""
  ariaLabel=""
  ariaDescribedBy=""
  type="button"
  (clicked)="handleClick($event)"
>
  Save Changes
</a11y-button>
```

| Input | Type | Default | Notes |
|---|---|---|---|
| `variant` | `primary\|secondary\|danger\|ghost\|icon-only` | `primary` | |
| `size` | `sm\|md\|lg` | `md` | |
| `disabled` | `boolean` | `false` | Uses `aria-disabled`, stays focusable |
| `loading` | `boolean` | `false` | Shows spinner, sets `aria-busy` |
| `leftIcon` | `string` | — | Material icon name |
| `rightIcon` | `string` | — | Material icon name |
| `ariaLabel` | `string` | — | **Required** for `icon-only` |
| `ariaDescribedBy` | `string` | — | ID of description element |
| `type` | `button\|submit\|reset` | `button` | |

| Output | Type | Description |
|---|---|---|
| `clicked` | `EventEmitter<MouseEvent>` | Not emitted when disabled or loading |

---

## `<a11y-input>`

```html
<a11y-input
  label="Email Address"
  type="email"
  placeholder="you@company.com"
  [required]="true"
  hint="We'll never share your email"
  prefixIcon="email"
  formControlName="email"
  [errorMessage]="emailError"
></a11y-input>
```

| Input | Type | Default | Notes |
|---|---|---|---|
| `label` | `string` | `''` | Rendered as `<label>` |
| `type` | `text\|email\|password\|number\|textarea\|select\|search` | `text` | |
| `placeholder` | `string` | `''` | Never used as a label substitute |
| `required` | `boolean` | `false` | Sets `aria-required` |
| `disabled` | `boolean` | `false` | |
| `hint` | `string` | `''` | Linked via `aria-describedby` |
| `errorMessage` | `string` | `''` | Sets `aria-invalid`, shows `role="alert"` |
| `prefixIcon` | `string` | `''` | Material icon name |
| `options` | `SelectOption[]` | `[]` | For `type="select"` |
| `fieldId` | `string` | auto | Auto-generated if not set |

Implements `ControlValueAccessor` — works with `formControlName` and `ngModel`.

---

## `<a11y-modal>`

```html
<a11y-modal
  [open]="isOpen"
  title="Confirm Action"
  size="sm"
  icon="warning"
  [closeOnBackdrop]="true"
  [showFooter]="true"
  (closed)="isOpen = false"
  (confirmed)="handleConfirm()"
>
  <p>Are you sure?</p>

  <!-- Optional custom footer -->
  <ng-container slot="footer">
    <a11y-button variant="ghost" (clicked)="isOpen = false">Cancel</a11y-button>
    <a11y-button variant="danger" (clicked)="handleConfirm()">Delete</a11y-button>
  </ng-container>
</a11y-modal>
```

| Input | Type | Default | Notes |
|---|---|---|---|
| `open` | `boolean` | `false` | Controls visibility |
| `title` | `string` | `'Dialog'` | Used as `aria-labelledby` target |
| `size` | `sm\|md\|lg\|fullscreen` | `md` | |
| `icon` | `string` | `''` | Material icon name in header |
| `closeOnBackdrop` | `boolean` | `true` | |
| `showFooter` | `boolean` | `true` | |
| `hasFooterContent` | `boolean` | `false` | Set to `true` when using `slot="footer"` |

---

## `<a11y-table>`

```html
<a11y-table
  [columns]="columns"
  [data]="rows"
  tableLabel="User list"
  caption="List of registered users"
  [selectable]="true"
  [loading]="false"
  emptyMessage="No users found."
  rowIdKey="id"
  (sortChanged)="onSort($event)"
  (selectionChanged)="onSelect($event)"
></a11y-table>
```

### TableColumn interface
```ts
interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  type?: 'text' | 'badge' | 'date' | 'number';
}
```

---

## `<a11y-tabs>` + `<a11y-tab>`

```html
<a11y-tabs ariaLabel="Product sections" [activeIndex]="0" (tabChanged)="onTab($event)">
  <a11y-tab label="Details" icon="info">
    <p>Tab 1 content</p>
  </a11y-tab>
  <a11y-tab label="Reviews" icon="star">
    <p>Tab 2 content</p>
  </a11y-tab>
  <a11y-tab label="Archived" [disabled]="true">
    <p>Disabled tab content</p>
  </a11y-tab>
</a11y-tabs>
```

---

## `<a11y-accordion>`

```html
<a11y-accordion
  [items]="accordionItems"
  [allowMultiple]="false"
  [openIds]="['item-1']"
  (toggled)="onToggle($event)"
></a11y-accordion>
```

### AccordionItem interface
```ts
interface AccordionItem {
  id: string;
  title: string;
  content: string;
  icon?: string;
  disabled?: boolean;
}
```

---

## `<a11y-dropdown>`

```html
<a11y-dropdown
  triggerLabel="Actions"
  triggerIcon="more_vert"
  [items]="menuItems"
  (itemSelected)="onSelect($event)"
></a11y-dropdown>
```

### DropdownItem interface
```ts
interface DropdownItem {
  id: string;
  label: string;
  icon?: string;
  disabled?: boolean;
  dividerBefore?: boolean;
}
```

---

## `<a11y-toast-container>` + `A11yToastService`

Place `<a11y-toast-container>` once in your `AppComponent` template.

```ts
// Inject the service
constructor(private toast: A11yToastService) {}

// Use it anywhere
this.toast.success('Saved!');                  // polite, 4s
this.toast.error('Something failed.');         // assertive, persistent
this.toast.warning('Session expiring soon.');  // polite, 5s
this.toast.info('New version available.');     // polite, 4s

// Custom
this.toast.push({
  type: 'success',
  message: 'Profile updated.',
  duration: 3000,
  action: 'Undo',
});
```

---

## `A11yAnnouncerService`

```ts
constructor(private announcer: A11yAnnouncerService) {}

// After a dynamic list update
this.announcer.announce('5 results loaded');

// After a validation failure
this.announcer.announceAssertive('Error: form submission failed');
```
