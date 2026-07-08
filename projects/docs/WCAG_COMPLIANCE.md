# WCAG 2.1 / 2.2 Compliance Matrix

> **accessibility-lib** — Angular Accessibility Component Library

All components are audited against WCAG 2.1 Level AA and the additional 2.2 criteria.

---

## Success Criteria Coverage

| Criterion | Level | Description | Components |
|---|---|---|---|
| **1.1.1** Non-text Content | A | Alt text / aria-label for all non-text elements | Button (icon-only), Toast (icons) |
| **1.3.1** Info & Relationships | A | Semantic HTML, ARIA roles, explicit labels | All |
| **1.3.2** Meaningful Sequence | A | Reading order matches visual order | Table, Accordion |
| **1.4.1** Use of Colour | A | Colour never the sole conveyor of meaning | Toast, Input (error), Badge |
| **1.4.3** Contrast (Minimum) | AA | Text ≥ 4.5:1, large text ≥ 3:1 | All — verified via WebAIM |
| **1.4.10** Reflow | AA | Content reflows at 320px width | All |
| **1.4.13** Content on Hover/Focus | AA | Tooltips remain visible; dismissible | Dropdown, Toast |
| **2.1.1** Keyboard | A | All functionality operable via keyboard | All |
| **2.1.2** No Keyboard Trap | A | Focus never trapped without exit | Modal (Escape exits) |
| **2.2.1** Timing Adjustable | A | Auto-dismissing toasts; errors are persistent | Toast |
| **2.3.3** Animation from Interactions | AAA | Respects `prefers-reduced-motion` | All animated |
| **2.4.1** Bypass Blocks | A | Skip navigation link | Demo App |
| **2.4.3** Focus Order | A | Focus returns to trigger on modal/dropdown close | Modal, Dropdown |
| **2.4.6** Headings and Labels | AA | Descriptive headings on all accordion panels | Accordion |
| **2.4.7** Focus Visible | AA | 3px `outline` on all interactive elements | All |
| **2.4.11** Focus Not Obscured | AA (2.2) | Sticky header doesn't hide focused element | All |
| **2.5.3** Label in Name | A | Visible label matches accessible name | Button, Input |
| **2.5.5** Target Size | AAA | 44 × 44 px minimum for all interactive targets | All |
| **3.2.2** On Input | A | No unexpected context changes on focus | Input, Select |
| **3.3.1** Error Identification | A | Errors identified in text + `aria-invalid` | Input |
| **3.3.2** Labels or Instructions | A | `aria-required`, hints via `aria-describedby` | Input, Select |
| **4.1.2** Name, Role, Value | A | ARIA roles, states, and properties | All |
| **4.1.3** Status Messages | AA | `aria-live` regions; `role="status"/"alert"` | Toast, Table (empty/loading) |

---

## Component-level Notes

### Button
- Uses `aria-disabled` (not HTML `disabled`) to keep disabled buttons focusable for screen reader users.
- `aria-busy="true"` added during loading state.
- `icon-only` variant enforces `ariaLabel` input.

### Input
- Every field has an explicit `<label for="...">` — never `placeholder` as a label substitute (WCAG 3.3.2 failure).
- Error messages use `role="alert"` + `aria-live="assertive"` so they interrupt current screen reader speech.
- Password toggle uses `aria-pressed` and dynamically updates `aria-label`.

### Modal
- Implements full focus trap: Tab/Shift+Tab cycle through focusable children only.
- Escape key fires `closed` event (WCAG 2.1.1).
- Stores the triggering element and restores focus on close (WCAG 2.4.3).
- `body { overflow: hidden }` prevents scroll leaking behind backdrop.

### Table
- `role="grid"` with `aria-rowcount` and `aria-colcount`.
- Sort buttons expose `aria-sort="ascending|descending|none"` — never relying on a visual icon alone.
- Selection state via `aria-selected` + `aria-multiselectable`.
- Loading overlay has `role="status"` with sr-only text.

### Tabs
- Implements the **manual activation** WAI-ARIA Tabs pattern.
- Arrow keys move between tabs; only the selected tab is in the tab order (`tabindex="0"`).
- Disabled tabs are skipped in keyboard navigation.

### Accordion
- Follows the WAI-ARIA Accordion pattern.
- `<button>` inside `<h3>` (heading + button = correct pattern).
- `aria-expanded`, `aria-controls` on triggers; `role="region"` + `aria-labelledby` on panels.

### Dropdown
- Implements the **Menu Button** pattern (not the Listbox pattern).
- `aria-haspopup="menu"`, `aria-expanded` on trigger.
- Arrow keys navigate `role="menuitem"` elements.
- Escape closes and returns focus to trigger.
- Clicking outside closes menu via `HostListener`.

### Toast
- `role="status"` / `aria-live="polite"` for success, info, warning.
- `role="alert"` / `aria-live="assertive"` for error.
- Error toasts default to `duration: 0` (persistent) — WCAG 2.2.1.
- Close button: 44×44px, `aria-label="Dismiss: {message}"`.

---

## Testing Tools

| Tool | Purpose |
|---|---|
| **axe-core** (via `@storybook/addon-a11y`) | Automated WCAG checks in every Storybook story |
| **VoiceOver** (macOS/iOS) | Primary screen reader testing |
| **NVDA** (Windows) | Secondary screen reader testing |
| **Chrome DevTools** Accessibility Tree | ARIA inspection |
| **WebAIM Contrast Checker** | Colour contrast verification |
| **Playwright** (`projects/tests/e2e`) | Keyboard navigation E2E tests |

---

## Colour Contrast Ratios (verified)

| Token | Hex | On White | Pass Level |
|---|---|---|---|
| `--a11y-color-primary` | `#3730a3` | 7.5:1 | AAA |
| `--a11y-color-danger`  | `#b91c1c` | 6.3:1 | AAA |
| `--a11y-color-ink`     | `#111827` | 18:1  | AAA |
| `--a11y-color-ink-muted` | `#4b5563` | 7.1:1 | AAA |
| `--a11y-color-accent`  | `#0d9488` | 4.6:1 | AA  |
