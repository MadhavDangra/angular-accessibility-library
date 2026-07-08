# Angular Accessibility Component Library

> **WCAG 2.1 / 2.2 Level AA** — 8 production-ready Angular 17 components.

---

## Quick Start

```bash
npm install
npm start
# → http://localhost:4200  (demo-app)
```

```bash
npm run storybook
# → http://localhost:6006  (storybook, after npm install)
```

```bash
npm test              # Jest unit tests
npm run build:lib     # Build distributable library → dist/accessibility-lib/
```

---

## Project Structure

```
angular-accessibility-library/
│
├── projects/
│   ├── accessibility-lib/          ← Reusable component library
│   │   └── src/lib/
│   │       ├── button/             a11y-button
│   │       ├── input/              a11y-input  (text, email, password, select, textarea)
│   │       ├── modal/              a11y-modal
│   │       ├── table/              a11y-table
│   │       ├── tabs/               a11y-tabs + a11y-tab
│   │       ├── accordion/          a11y-accordion
│   │       ├── dropdown/           a11y-dropdown
│   │       ├── toast/              a11y-toast-container + A11yToastService
│   │       └── shared/
│   │           ├── announcer.service.ts   ← Programmatic aria-live
│   │           └── tokens.scss            ← CSS custom properties
│   │
│   ├── demo-app/                   ← Angular app showing all components
│   │   └── src/app/app.component.ts
│   │
│   ├── storybook/                  ← Storybook with axe a11y addon
│   │   ├── .storybook/
│   │   └── stories/
│   │
│   ├── docs/
│   │   ├── WCAG_COMPLIANCE.md      ← Full criteria matrix
│   │   └── API_REFERENCE.md        ← All inputs/outputs/interfaces
│   │
│   └── tests/
│       ├── unit/                   ← Jest specs
│       └── e2e/                    ← Playwright accessibility E2E
│
├── angular.json
├── package.json
└── tsconfig.json
```

---

## Components

| Selector | Description | Key WCAG |
|---|---|---|
| `<a11y-button>` | 5 variants, 3 sizes, loading/disabled states | 2.5.5, 2.4.7, 4.1.2 |
| `<a11y-input>` | text/email/password/select/textarea; ControlValueAccessor | 3.3.1, 3.3.2, 4.1.3 |
| `<a11y-modal>` | Focus trap, Escape-to-close, focus restoration | 2.1.2, 2.4.3, 1.3.1 |
| `<a11y-table>` | Sortable, selectable, loading/empty states | 1.3.1, 2.1.1, 4.1.3 |
| `<a11y-tabs>` | WAI-ARIA Tabs — arrow keys, aria-selected | 2.1.1, 1.3.1, 4.1.2 |
| `<a11y-accordion>` | Expand/collapse, aria-expanded, role="region" | 2.1.1, 4.1.2, 1.3.1 |
| `<a11y-dropdown>` | WAI-ARIA Menu Button — arrow keys, aria-haspopup | 2.1.1, 2.4.3, 1.3.1 |
| `<a11y-toast-container>` | role="status"/"alert", persistent errors | 4.1.3, 2.2.1, 1.4.1 |

---

## Continuing Development in a New Chat

Paste the following context block at the start of your next conversation:

---

**PROJECT CONTEXT — Angular Accessibility Library**

Stack: Angular 17, standalone components, Angular Material 17, SCSS, Jest tests, Playwright E2E, Storybook 8 with `@storybook/addon-a11y`.

Structure:
- `projects/accessibility-lib/src/lib/` — component library (button, input, modal, table, tabs, accordion, dropdown, toast, shared)
- `projects/demo-app/src/app/app.component.ts` — full demo showcasing all 8 components
- `projects/storybook/stories/` — Storybook stories per component
- `projects/tests/unit/` — Jest unit tests; `projects/tests/e2e/` — Playwright E2E
- `projects/docs/` — WCAG_COMPLIANCE.md, API_REFERENCE.md

Design tokens live in CSS custom properties prefixed `--a11y-*` (e.g. `--a11y-color-primary`, `--a11y-radius-md`).
All components are standalone, `ChangeDetectionStrategy.OnPush`, and export from `projects/accessibility-lib/src/public-api.ts`.

**Next steps I want to work on:**
- [ ] Add `<a11y-date-picker>` (WCAG calendar widget pattern)
- [ ] Add `<a11y-combobox>` (autocomplete with aria-autocomplete)
- [ ] Add `<a11y-progress>` (progress bar + spinner with aria-valuenow)
- [ ] Add dark mode support using `prefers-color-scheme`
- [ ] Add Storybook stories for all 8 components
- [ ] Complete E2E tests for Table, Tabs, Accordion, Dropdown
- [ ] Publish library to npm

---

## Design Tokens (CSS Custom Properties)

| Token | Value | Notes |
|---|---|---|
| `--a11y-color-primary` | `#3730a3` | 7.5:1 contrast |
| `--a11y-color-danger`  | `#b91c1c` | 6.3:1 contrast |
| `--a11y-color-ink`     | `#111827` | 18:1 contrast |
| `--a11y-color-focus`   | `#6366f1` | Focus ring colour |
| `--a11y-font-sans`     | Inter | Body text |
| `--a11y-font-serif`    | Fraunces | Headings |
| `--a11y-font-mono`     | DM Mono | Labels, badges |
| `--a11y-radius-sm/md/lg` | 6/10/16px | Border radius |

---

## Docs

- [WCAG Compliance Matrix](./projects/docs/WCAG_COMPLIANCE.md)
- [Component API Reference](./projects/docs/API_REFERENCE.md)
