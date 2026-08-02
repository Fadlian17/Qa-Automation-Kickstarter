import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model - Checkboxes (Back Office)
 * Halaman /checkboxes pada the-internet.herokuapp.com
 */
export class CheckboxesPage {
  readonly page: Page;
  readonly checkboxes: Locator;

  constructor(page: Page) {
    this.page = page;
    this.checkboxes = page.locator('input[type="checkbox"]');
  }

  async goto() {
    await this.page.goto('/checkboxes');
  }

  async check(index: number) {
    await this.checkboxes.nth(index).check();
  }

  async uncheck(index: number) {
    await this.checkboxes.nth(index).uncheck();
  }

  async isChecked(index: number): Promise<boolean> {
    return this.checkboxes.nth(index).isChecked();
  }
}
