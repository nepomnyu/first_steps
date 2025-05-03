import { test, expect } from '@playwright/test';
import { MainPage } from '../../models/MainPage';

let mainPage: MainPage;

test.describe('Играемся с группами', () => {
  test.beforeEach(async ({ page }) => {
    mainPage = new MainPage(page);
    await mainPage.openMainPage();
  });

  test('Check selector and href attribute', async ({ page }) => {
    await test.step('Проверяем наличие элемента', async () => {
      await expect(page.getByRole('link', { name: 'Playwright logo Playwright' })).toBeVisible();
    });

    await test.step('Проверяем смена значения атрибута', async () => {
      await expect(page.getByRole('link', { name: 'Playwright logo Playwright' })).toHaveAttribute(
        'href',
        '/',
      );
    });
  });

  test('Assert text', async ({ page }) => {
    //Тут не нравится локатор, когда продолжу заниматься заменить на нормальный
    await expect(page.locator('h1')).toContainText(
      'Playwright enables reliable end-to-end testing for modern web apps.',
    );
  });

  test('Check light-dark mod', async ({ page }) => {
    await page.getByLabel('Switch between dark and light').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });
});
