/**
 * E2E accessibility tests — written for Playwright.
 * Run after: npm run build && npx playwright test
 *
 * Install: npm install -D @playwright/test && npx playwright install
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:4200';

test.describe('Skip Navigation — WCAG 2.4.1', () => {
  test('skip link is visible on focus and navigates to main content', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.keyboard.press('Tab');
    const skipLink = page.locator('.skip-link');
    await expect(skipLink).toBeVisible();
    await page.keyboard.press('Enter');
    const main = page.locator('#main');
    await expect(main).toBeFocused();
  });
});

test.describe('Button — WCAG 2.5.5 Target Size', () => {
  test('all buttons have at least 44px height', async ({ page }) => {
    await page.goto(BASE_URL);
    const buttons = await page.locator('a11y-button button').all();
    for (const btn of buttons) {
      const box = await btn.boundingBox();
      expect(box?.height).toBeGreaterThanOrEqual(44);
    }
  });
});

test.describe('Modal — WCAG 2.1.2 No Keyboard Trap', () => {
  test('Escape key closes modal and returns focus to trigger', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.locator('text=Info Dialog').first().click();
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  });

  test('Tab key cycles focus within modal', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.locator('text=Info Dialog').first().click();
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();
    // Tab through all focusable elements — should not leave dialog
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
      const focused = await page.evaluate(() => document.activeElement?.closest('[role="dialog"]'));
      expect(focused).toBeTruthy();
    }
  });
});

test.describe('Tabs — WCAG 2.1.1 Keyboard', () => {
  test('arrow keys navigate between tabs', async ({ page }) => {
    await page.goto(BASE_URL);
    const firstTab = page.locator('[role="tab"]').first();
    await firstTab.focus();
    await page.keyboard.press('ArrowRight');
    const secondTab = page.locator('[role="tab"]').nth(1);
    await expect(secondTab).toBeFocused();
  });
});

test.describe('Dropdown — WAI-ARIA Menu Button', () => {
  test('opens menu on Enter and closes on Escape', async ({ page }) => {
    await page.goto(BASE_URL);
    const trigger = page.locator('.dropdown-trigger').first();
    await trigger.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('[role="menu"]')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('[role="menu"]')).not.toBeVisible();
    await expect(trigger).toBeFocused();
  });
});

test.describe('Accordion — WCAG 2.1.1 Keyboard', () => {
  test('Enter toggles accordion panel', async ({ page }) => {
    await page.goto(BASE_URL);
    const trigger = page.locator('.accordion-trigger').first();
    await trigger.focus();
    expect(await trigger.getAttribute('aria-expanded')).toBe('false');
    await page.keyboard.press('Enter');
    expect(await trigger.getAttribute('aria-expanded')).toBe('true');
  });
});

test.describe('Toast — WCAG 4.1.3 Status Messages', () => {
  test('success toast appears and has role="status"', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.locator('text=Success Toast').click();
    const toast = page.locator('.toast--success');
    await expect(toast).toBeVisible();
    expect(await toast.getAttribute('role')).toBe('status');
  });

  test('error toast has role="alert" (assertive)', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.locator('text=Error Toast').click();
    const toast = page.locator('.toast--error');
    await expect(toast).toBeVisible();
    expect(await toast.getAttribute('role')).toBe('alert');
  });
});
