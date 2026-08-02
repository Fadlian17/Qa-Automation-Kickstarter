import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model - Key Presses (Back Office)
 * Halaman /key_presses pada the-internet.herokuapp.com
 */
export class KeyPressesPage {
  readonly page: Page;
  readonly target: Locator;
  readonly result: Locator;

  constructor(page: Page) {
    this.page = page;
    this.target = page.locator('#target');
    this.result = page.locator('#result');
  }

  async goto() {
    await this.page.goto('/key_presses');
  }

  async pressKey(key: string) {
    await this.target.press(key);
  }
}
