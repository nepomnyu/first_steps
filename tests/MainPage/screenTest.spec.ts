import { test, expect } from '@playwright/test';

const ligtMods = ['light', 'dark'];

test.describe('Скрин тест', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://playwright.dev/');
  });

  ligtMods.forEach((value) => {
    test(`Проверка активного ${value} стиля страницы`, async ({ page }) => {
      await page.evaluate((theme) => {
        document.querySelector('html')?.setAttribute('data-theme', theme);
      }, value);

      await expect(page).toHaveScreenshot(`pageWith${value}.png`);
    });
  });
});
