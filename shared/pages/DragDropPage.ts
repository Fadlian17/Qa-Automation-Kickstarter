import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model - Drag and Drop (Back Office)
 * Halaman /drag_and_drop pada the-internet.herokuapp.com
 */
export class DragDropPage {
  readonly page: Page;
  readonly columnA: Locator;
  readonly columnB: Locator;

  constructor(page: Page) {
    this.page = page;
    this.columnA = page.locator('#column-a');
    this.columnB = page.locator('#column-b');
  }

  async goto() {
    await this.page.goto('/drag_and_drop');
  }

  async dragAtoB() {
    await this.page.dragAndDrop('#column-a', '#column-b');
  }

  async headerOf(locator: Locator): Promise<string> {
    return locator.locator('header').innerText();
  }
}
