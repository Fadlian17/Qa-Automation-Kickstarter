import { test, expect } from '@playwright/test';
import { AdminLoginPage } from '../shared/pages/AdminLoginPage';
import testData from '../shared/test-data/users.json';
import path from 'path';

/**
 * Studi kasus: Back Office Tools
 * Target: the-internet.herokuapp.com (public demo site untuk latihan)
 * Mewakili: layer "Back Office" - login admin, tabel data, upload file
 */

test.describe('Back Office - Login @regression', () => {
  test('Login dengan kredensial valid harus berhasil @smoke @critical', async ({ page }) => {
    const loginPage = new AdminLoginPage(page);
    await loginPage.goto();
    await loginPage.login(testData.backoffice.admin.username, testData.backoffice.admin.password);

    await expect(loginPage.flashMessage).toContainText('You logged into a secure area');
    await expect(page).toHaveURL(/.*secure/);
  });

  test('Login dengan password salah harus menampilkan error', async ({ page }) => {
    const loginPage = new AdminLoginPage(page);
    await loginPage.goto();
    await loginPage.login(testData.backoffice.admin.username, 'passwordSalah123');

    await expect(loginPage.flashMessage).toContainText('Your password is invalid');
  });
});

test.describe('Back Office - Data Table @regression', () => {
  test('Tabel data harus bisa di-sort berdasarkan kolom @smoke', async ({ page }) => {
    await page.goto('/tables');

    const table = page.locator('#table1');
    await expect(table).toBeVisible();

    // Klik header "Last Name" untuk sort
    await page.locator('#table1 thead th').filter({ hasText: 'Last Name' }).click();

    const firstRowLastName = await page.locator('#table1 tbody tr').first().locator('td').first().textContent();
    expect(firstRowLastName).toBeTruthy();
  });
});

test.describe('Back Office - File Upload @regression', () => {
  test('Upload file harus berhasil dan menampilkan nama file', async ({ page }) => {
    await page.goto('/upload');

    // Buat file dummy sementara untuk upload
    const filePath = path.join(__dirname, 'dummy-upload.txt');

    const fileInput = page.locator('#file-upload');
    await fileInput.setInputFiles({
      name: 'dummy-upload.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('ini file dummy untuk test upload'),
    });

    await page.locator('#file-submit').click();
    await expect(page.locator('#uploaded-files')).toContainText('dummy-upload.txt');
  });
});
