import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model - Dashboard / Home (Back Office)
 * Halaman utama the-internet.herokuapp.com yang memuat semua modul.
 */
export class DashboardPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly subheading: Locator;
  readonly exampleLinks: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.locator('h1');
    this.subheading = page.locator('h2');
    this.exampleLinks = page.locator('ul li a');
  }

  async goto() {
    await this.page.goto('/');
  }

  async getLinkNames(): Promise<string[]> {
    return this.exampleLinks.allTextContents();
  }

  async getLinkHrefs(): Promise<(string | null)[]> {
    return this.exampleLinks.evaluateAll((links) =>
      links.map((link) => link.getAttribute('href')),
    );
  }

  async openModule(name: string) {
    await this.exampleLinks.filter({ hasText: name }).click();
  }
}
