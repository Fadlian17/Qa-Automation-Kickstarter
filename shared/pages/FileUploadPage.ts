import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model - File Upload (Back Office)
 * Halaman /upload pada the-internet.herokuapp.com
 */
export class FileUploadPage {
  readonly page: Page;
  readonly fileInput: Locator;
  readonly submitButton: Locator;
  readonly uploadedFiles: Locator;

  constructor(page: Page) {
    this.page = page;
    this.fileInput = page.locator('#file-upload');
    this.submitButton = page.locator('#file-submit');
    this.uploadedFiles = page.locator('#uploaded-files');
  }

  async goto() {
    await this.page.goto('/upload');
  }

  async uploadBuffer(name: string, content: string) {
    await this.fileInput.setInputFiles({
      name,
      mimeType: 'text/plain',
      buffer: Buffer.from(content),
    });
    await this.submitButton.click();
  }
}
