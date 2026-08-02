import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model - Frames (Back Office)
 * Halaman /nested_frames dan /iframe pada the-internet.herokuapp.com
 */
export class FramesPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async gotoNested() {
    await this.page.goto('/nested_frames');
  }

  async gotoIframe() {
    await this.page.goto('/iframe');
  }

  nestedFrameBody(name: 'left' | 'middle' | 'right'): Locator {
    return this.page
      .frameLocator('frame[name="frame-top"]')
      .frameLocator(`frame[name="frame-${name}"]`)
      .locator('body');
  }

  bottomFrameBody(): Locator {
    return this.page.frameLocator('frame[name="frame-bottom"]').locator('body');
  }

  editorBody(): Locator {
    return this.page.frameLocator('#mce_0_ifr').locator('#tinymce');
  }
}
