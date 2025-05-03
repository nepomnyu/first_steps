import { test, expect } from '@playwright/test';
import { MainPage } from '../../models/MainPage';

const ligtMods = ['light', 'dark'];

test.describe('Скрин тест', () => {
  test.beforeEach(async ({ page }) => {
    const mainPage = new MainPage(page);
    await mainPage.openMainPage();
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
