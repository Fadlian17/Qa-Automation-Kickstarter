import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model - Inputs (Back Office)
 * Halaman /inputs pada the-internet.herokuapp.com
 */
export class InputsPage {
  readonly page: Page;
  readonly input: Locator;

  constructor(page: Page) {
    this.page = page;
    this.input = page.locator('input[type="number"]');
  }

  async goto() {
    await this.page.goto('/inputs');
  }

  async fill(value: string) {
    await this.input.fill(value);
  }

  async value(): Promise<string> {
    return this.input.inputValue();
  }

  async press(key: string) {
    await this.input.focus();
    await this.input.press(key);
  }
}
