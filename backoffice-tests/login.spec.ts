import { test, expect } from '@playwright/test';
import { AdminLoginPage } from '../shared/pages/AdminLoginPage';
import usersData from '../shared/test-data/users.json';
import backofficeData from '../shared/test-data/backoffice.json';

/**
 * Studi kasus: Back Office - Form Authentication
 * Target: the-internet.herokuapp.com
 * Data test: shared/test-data/users.json (kredensial) + backoffice.json (pesan)
 */

const admin = usersData.backoffice.admin;
const data = backofficeData.login;

test.describe('Back Office - Login @regression', () => {
  test('Login dengan kredensial valid harus berhasil @smoke @critical', async ({ page }) => {
    const loginPage = new AdminLoginPage(page);
    await loginPage.goto();
    await loginPage.login(admin.username, admin.password);

    await expect(loginPage.flashMessage).toContainText(data.secure_message);
    await expect(page).toHaveURL(/.*secure/);
  });

  test('Login dengan password salah harus menampilkan error @smoke', async ({ page }) => {
    const loginPage = new AdminLoginPage(page);
    await loginPage.goto();
    await loginPage.login(admin.username, data.invalid_password);

    await expect(loginPage.flashMessage).toContainText(data.invalid_password_message);
  });

  test('Login dengan username kosong harus menampilkan error @smoke', async ({ page }) => {
    const loginPage = new AdminLoginPage(page);
    await loginPage.goto();
    await loginPage.login('', admin.password);

    await expect(loginPage.flashMessage).toContainText(data.username_required_message);
  });

  test('Login dengan password kosong harus menampilkan error', async ({ page }) => {
    const loginPage = new AdminLoginPage(page);
    await loginPage.goto();
    await loginPage.login(admin.username, '');

    await expect(loginPage.flashMessage).toContainText(data.password_required_message);
  });

  test('Logout dari secure area harus kembali ke halaman login @smoke', async ({ page }) => {
    const loginPage = new AdminLoginPage(page);
    await loginPage.goto();
    await loginPage.login(admin.username, admin.password);

    await page.locator(`a[href="${data.logout_url}"]`).click();
    await expect(page).toHaveURL(/\/login$/);
    await expect(loginPage.loginButton).toBeVisible();
  });
});
