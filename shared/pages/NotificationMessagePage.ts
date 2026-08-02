import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model - Notification Message (Back Office)
 * Halaman /notification_message_rendered pada the-internet.herokuapp.com
 */
export class NotificationMessagePage {
  readonly page: Page;
  readonly clickLink: Locator;
  readonly flash: Locator;

  constructor(page: Page) {
    this.page = page;
    this.clickLink = page.locator('a', { hasText: 'Click here' });
    this.flash = page.locator('#flash');
  }

  async goto() {
    await this.page.goto('/notification_message_rendered');
  }

  async clickHere() {
    await this.clickLink.click();
  }
}
