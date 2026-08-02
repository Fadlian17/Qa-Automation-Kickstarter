import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model - Shadow DOM (Back Office)
 * Halaman /shadowdom pada the-internet.herokuapp.com
 */
export class ShadowDomPage {
  readonly page: Page;
  readonly host: Locator;

  constructor(page: Page) {
    this.page = page;
    this.host = page.locator('my-paragraph');
  }

  async goto() {
    await this.page.goto('/shadowdom');
  }
}
