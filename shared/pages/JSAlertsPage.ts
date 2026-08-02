import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model - JavaScript Alerts (Back Office)
 * Halaman /javascript_alerts pada the-internet.herokuapp.com
 */
export class JSAlertsPage {
  readonly page: Page;
  readonly result: Locator;
  readonly alertButton: Locator;
  readonly confirmButton: Locator;
  readonly promptButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.result = page.locator('#result');
    this.alertButton = page.locator('#content button', { hasText: 'JS Alert' });
    this.confirmButton = page.locator('#content button', { hasText: 'JS Confirm' });
    this.promptButton = page.locator('#content button', { hasText: 'JS Prompt' });
  }

  async goto() {
    await this.page.goto('/javascript_alerts');
  }
}
