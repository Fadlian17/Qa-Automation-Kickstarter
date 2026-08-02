import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model - Entry Ad (Back Office)
 * Halaman /entry_ad pada the-internet.herokuapp.com
 */
export class EntryAdPage {
  readonly page: Page;
  readonly modal: Locator;
  readonly closeButton: Locator;
  readonly restartAd: Locator;

  constructor(page: Page) {
    this.page = page;
    this.modal = page.locator('#modal');
    this.closeButton = page.locator('#modal .modal-footer p');
    this.restartAd = page.locator('#restart-ad');
  }

  async goto() {
    await this.page.goto('/entry_ad');
  }

  async closeModal() {
    await this.closeButton.click();
  }
}
