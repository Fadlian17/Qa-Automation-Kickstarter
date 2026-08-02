import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model - Infinite Scroll (Back Office)
 * Halaman /infinite_scroll pada the-internet.herokuapp.com
 */
export class InfiniteScrollPage {
  readonly page: Page;
  readonly addedItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addedItems = page.locator('.jscroll-added');
  }

  async goto() {
    await this.page.goto('/infinite_scroll');
  }

  async scrollToBottom() {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }
}
