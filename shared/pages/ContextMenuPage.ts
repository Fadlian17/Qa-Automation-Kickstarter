import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model - Context Menu (Back Office)
 * Halaman /context_menu pada the-internet.herokuapp.com
 */
export class ContextMenuPage {
  readonly page: Page;
  readonly hotspot: Locator;

  constructor(page: Page) {
    this.page = page;
    this.hotspot = page.locator('#hot-spot');
  }

  async goto() {
    await this.page.goto('/context_menu');
  }

  async rightClick() {
    await this.hotspot.click({ button: 'right' });
  }
}
