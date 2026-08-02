import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model - Status Codes (Back Office)
 * Halaman /status_codes pada the-internet.herokuapp.com
 */
export class StatusCodesPage {
  readonly page: Page;
  readonly content: Locator;

  constructor(page: Page) {
    this.page = page;
    this.content = page.locator('#content');
  }

  async goto() {
    await this.page.goto('/status_codes');
  }

  async open(code: string) {
    await this.page.goto(`/status_codes/${code}`);
  }

  statusLink(code: string): Locator {
    // href di halaman ini relatif (tanpa leading slash)
    return this.page.locator(`a[href="status_codes/${code}"]`);
  }
}
