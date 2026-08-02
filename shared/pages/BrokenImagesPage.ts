import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model - Broken Images (Back Office)
 * Halaman /broken_images pada the-internet.herokuapp.com
 */
export class BrokenImagesPage {
  readonly page: Page;
  readonly images: Locator;

  constructor(page: Page) {
    this.page = page;
    this.images = page.locator('.example img');
  }

  async goto() {
    await this.page.goto('/broken_images');
  }

  async imageNaturalWidths(): Promise<number[]> {
    return this.images.evaluateAll((images) =>
      images.map((img) => (img as HTMLImageElement).naturalWidth),
    );
  }
}
