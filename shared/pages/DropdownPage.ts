import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model - Dropdown List (Back Office)
 * Halaman /dropdown pada the-internet.herokuapp.com
 */
export class DropdownPage {
  readonly page: Page;
  readonly select: Locator;

  constructor(page: Page) {
    this.page = page;
    this.select = page.locator('#dropdown');
  }

  async goto() {
    await this.page.goto('/dropdown');
  }

  async selectByLabel(label: string) {
    await this.select.selectOption({ label });
  }

  async selectedValue(): Promise<string> {
    return this.select.inputValue();
  }
}
