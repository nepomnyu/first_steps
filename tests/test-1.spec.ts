import { test, expect } from '@playwright/test';

test.describe('Играемся с группами', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://playwright.dev/');
  });
  test('Check selector and href attribute', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Playwright logo Playwright' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Playwright logo Playwright' })).toHaveAttribute(
      'href',
      '/',
    );
  });

  test('Assert text', async ({ page }) => {
    await expect(page.locator('h1')).toContainText(
      'Playwright enables reliable end-to-end testing for modern web apps.',
    );
  });

  test('Check light-dark mod', async ({ page }) => {
    await page.getByLabel('Switch between dark and light').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });
});
