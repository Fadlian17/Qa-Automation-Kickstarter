import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model - Redirect Link (Back Office)
 * Halaman /redirector pada the-internet.herokuapp.com
 */
export class RedirectPage {
  readonly page: Page;
  readonly hereLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.hereLink = page.locator('a', { hasText: 'here' });
  }

  async goto() {
    await this.page.goto('/redirector');
  }
}
