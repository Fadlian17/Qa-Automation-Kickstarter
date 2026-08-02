import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model - Dynamic Controls (Back Office)
 * Halaman /dynamic_controls pada the-internet.herokuapp.com
 */
export class DynamicControlsPage {
  readonly page: Page;
  readonly checkbox: Locator;
  readonly checkboxButton: Locator;
  readonly input: Locator;
  readonly inputButton: Locator;
  readonly message: Locator;

  constructor(page: Page) {
    this.page = page;
    this.checkbox = page.locator('#checkbox');
    this.checkboxButton = page.locator('#checkbox-example button');
    this.input = page.locator('#input-example input[type="text"]');
    this.inputButton = page.locator('#input-example button');
    this.message = page.locator('#message');
  }

  async goto() {
    await this.page.goto('/dynamic_controls');
  }

  async removeCheckbox() {
    await this.checkboxButton.click();
  }

  async addCheckbox() {
    await this.checkboxButton.click();
  }

  async enableInput() {
    await this.inputButton.click();
  }

  async disableInput() {
    await this.inputButton.click();
  }
}
