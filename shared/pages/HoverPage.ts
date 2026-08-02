import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model - Hovers (Back Office)
 * Halaman /hovers pada the-internet.herokuapp.com
 */
export class HoverPage {
  readonly page: Page;
  readonly figures: Locator;

  constructor(page: Page) {
    this.page = page;
    this.figures = page.locator('.figure');
  }

  async goto() {
    await this.page.goto('/hovers');
  }

  async hoverFigure(index: number) {
    await this.figures.nth(index).hover();
  }

  async captionText(index: number): Promise<string> {
    return this.figures.nth(index).locator('.figcaption').innerText();
  }

  captionLocator(index: number): Locator {
    return this.figures.nth(index).locator('.figcaption');
  }
}
