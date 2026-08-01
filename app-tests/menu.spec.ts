import { appTest as test, expect } from '../shared/fixtures/app';
import { LoginPage } from '../shared/pages/LoginPage';
import { InventoryPage } from '../shared/pages/InventoryPage';
import { MenuPage } from '../shared/pages/MenuPage';
import testData from '../shared/test-data/app.json';

/**
 * Studi kasus: End User App - Sidebar Menu
 * Target: saucedemo.com
 * Docs: https://www.saucedemo.com
 */

const users = testData.users;
const products = testData.products;

async function gotoInventory(page: import('@playwright/test').Page) {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(users.standard.username, users.standard.password);
  return new InventoryPage(page);
}

test.describe('End User App - Sidebar Menu @regression', () => {
  test('Menu harus terbuka setelah klik burger button @smoke', async ({ page }) => {
    const inventoryPage = await gotoInventory(page);
    const menuPage = new MenuPage(page);
    await menuPage.open();
    await expect(menuPage.logoutLink).toBeVisible();
    await expect(menuPage.aboutLink).toBeVisible();
  });

  test('Menu harus bisa ditutup', async ({ page }) => {
    const inventoryPage = await gotoInventory(page);
    const menuPage = new MenuPage(page);
    await menuPage.open();
    await menuPage.close();
    await expect(menuPage.logoutLink).toBeHidden();
  });

  test('All Items harus menampilkan kembali halaman produk @smoke', async ({ page }) => {
    const inventoryPage = await gotoInventory(page);
    const menuPage = new MenuPage(page);
    await inventoryPage.addToCart(products.backpack);
    await menuPage.open();
    await menuPage.allItemsLink.click();
    await expect(page).toHaveURL(/.*inventory/);
    await expect(inventoryPage.title).toHaveText('Products');
  });

  test('Reset App State harus mengosongkan cart @smoke', async ({ page }) => {
    const inventoryPage = await gotoInventory(page);
    const menuPage = new MenuPage(page);
    await inventoryPage.addToCart(products.backpack);
    await expect(inventoryPage.cartBadge).toHaveText('1');
    await menuPage.open();
    await menuPage.resetAppState();
    await expect(inventoryPage.cartBadge).toHaveCount(0);
  });

  test('Logout dari menu harus kembali ke halaman login', async ({ page }) => {
    const inventoryPage = await gotoInventory(page);
    const menuPage = new MenuPage(page);
    const loginPage = new LoginPage(page);
    await menuPage.open();
    await menuPage.logout();
    await expect(page).toHaveURL(/saucedemo\.com\/$/);
    await expect(loginPage.loginButton).toBeVisible();
  });
});
