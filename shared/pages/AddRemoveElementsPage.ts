import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model - Add/Remove Elements (Back Office)
 * Halaman /add_remove_elements pada the-internet.herokuapp.com
 */
export class AddRemoveElementsPage {
  readonly page: Page;
  readonly addButton: Locator;
  readonly deleteButtons: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addButton = page.locator('#content button', { hasText: 'Add Element' });
    this.deleteButtons = page.locator('.added-manually');
  }

  async goto() {
    await this.page.goto('/add_remove_elements/');
  }

  async addElement(count: number) {
    for (let i = 0; i < count; i++) {
      await this.addButton.click();
    }
  }

  async removeElement(index: number) {
    await this.deleteButtons.nth(index).click();
  }

  async count(): Promise<number> {
    return this.deleteButtons.count();
  }
}
