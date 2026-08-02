import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model - Horizontal Slider (Back Office)
 * Halaman /horizontal_slider pada the-internet.herokuapp.com
 */
export class HorizontalSliderPage {
  readonly page: Page;
  readonly slider: Locator;
  readonly range: Locator;

  constructor(page: Page) {
    this.page = page;
    this.slider = page.locator('input[type="range"]');
    this.range = page.locator('#range');
  }

  async goto() {
    await this.page.goto('/horizontal_slider');
  }
}
