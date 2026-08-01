import { appTest as test, expect } from '../shared/fixtures/app';
import { LoginPage } from '../shared/pages/LoginPage';
import { InventoryPage } from '../shared/pages/InventoryPage';
import { MenuPage } from '../shared/pages/MenuPage';
import testData from '../shared/test-data/app.json';

/**
 * Studi kasus: End User App - Login (skenario lanjutan)
 * Target: saucedemo.com
 * Docs: https://www.saucedemo.com
 */

const users = testData.users;
const errors = testData.error_messages;

test.describe('End User App - Login Validation @regression', () => {
  test('Login dengan kredensial invalid harus menampilkan error @smoke', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.invalid.username, users.invalid.password);

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText(errors.invalid_credentials);
  });

  test('Login tanpa username harus menampilkan error @smoke', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('', users.standard.password);

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText(errors.username_required);
  });

  test('Login tanpa password harus menampilkan error @smoke', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.standard.username, '');

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText(errors.password_required);
  });

  test('Login dengan problem_user harus berhasil masuk', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    await loginPage.goto();
    await loginPage.login(users.problem.username, users.problem.password);

    await expect(page).toHaveURL(/.*inventory/);
    await expect(inventoryPage.title).toHaveText('Products');
  });

  test('Login dengan visual_user harus berhasil masuk', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    await loginPage.goto();
    await loginPage.login(users.visual.username, users.visual.password);

    await expect(page).toHaveURL(/.*inventory/);
    await expect(inventoryPage.title).toHaveText('Products');
  });

  test('Login dengan error_user harus berhasil masuk', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    await loginPage.goto();
    await loginPage.login(users.error.username, users.error.password);

    await expect(page).toHaveURL(/.*inventory/);
    await expect(inventoryPage.title).toHaveText('Products');
  });

  test('Login dengan performance_glitch_user harus berhasil masuk (lambat)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    await loginPage.goto();
    await loginPage.login(users.performance_glitch.username, users.performance_glitch.password);

    await expect(page).toHaveURL(/.*inventory/, { timeout: 20000 });
    await expect(inventoryPage.title).toHaveText('Products');
  });

  test('Logout dari menu harus kembali ke halaman login @smoke @critical', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const menuPage = new MenuPage(page);

    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);
    await expect(inventoryPage.title).toHaveText('Products');

    await menuPage.open();
    await menuPage.logout();

    await expect(page).toHaveURL(/saucedemo\.com\/$/);
    await expect(loginPage.loginButton).toBeVisible();
  });
});
