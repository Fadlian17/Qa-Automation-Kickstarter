import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model - Multiple Windows (Back Office)
 * Halaman /windows pada the-internet.herokuapp.com
 */
export class WindowsPage {
  readonly page: Page;
  readonly clickHereLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.clickHereLink = page.locator('a', { hasText: 'Click Here' });
  }

  async goto() {
    await this.page.goto('/windows');
  }

  async openNewWindow(): Promise<Page> {
    const [newPage] = await Promise.all([
      this.page.waitForEvent('popup'),
      this.clickHereLink.click(),
    ]);
    await newPage.waitForLoadState();
    return newPage;
  }
}
