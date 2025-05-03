import { Page } from '@playwright/test';

export class MainPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }
  async openMainPage() {
    await this.page.goto('https://playwright.dev/');
  }
}
