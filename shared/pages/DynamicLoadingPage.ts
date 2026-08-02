import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model - Dynamic Loading (Back Office)
 * Halaman /dynamic_loading/:example pada the-internet.herokuapp.com
 */
export class DynamicLoadingPage {
  readonly page: Page;
  readonly startButton: Locator;
  readonly loadingText: Locator;
  readonly finishText: Locator;

  constructor(page: Page) {
    this.page = page;
    this.startButton = page.locator('#start button');
    this.loadingText = page.locator('#loading');
    this.finishText = page.locator('#finish');
  }

  async goto(example: 1 | 2 = 1) {
    await this.page.goto(`/dynamic_loading/${example}`);
  }

  async start() {
    await this.startButton.click();
  }
}
