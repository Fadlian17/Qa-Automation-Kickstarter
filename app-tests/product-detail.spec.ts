import { appTest as test, expect } from '../shared/fixtures/app';
import { LoginPage } from '../shared/pages/LoginPage';
import { InventoryPage } from '../shared/pages/InventoryPage';
import { ProductDetailPage } from '../shared/pages/ProductDetailPage';
import testData from '../shared/test-data/app.json';

/**
 * Studi kasus: End User App - Product Detail
 * Target: saucedemo.com
 * Docs: https://www.saucedemo.com
 */

const users = testData.users;
const products = testData.products;

async function openBackpack(page: import('@playwright/test').Page) {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(users.standard.username, users.standard.password);
  const inventoryPage = new InventoryPage(page);
  await inventoryPage.openProduct(products.backpack);
  await expect(page).toHaveURL(/.*inventory-item.html/);
  return new ProductDetailPage(page);
}

test.describe('End User App - Product Detail @regression', () => {
  test('Klik produk harus menuju halaman detail @smoke', async ({ page }) => {
    await openBackpack(page);
    await expect(page).toHaveURL(/inventory-item\.html\?id=/);
  });

  test('Halaman detail harus menampilkan nama produk yang benar @smoke @critical', async ({ page }) => {
    const detailPage = await openBackpack(page);
    await expect(detailPage.name).toHaveText(products.backpack);
  });

  test('Halaman detail harus menampilkan harga yang benar', async ({ page }) => {
    const detailPage = await openBackpack(page);
    await expect(detailPage.price).toHaveText(products.expected.backpack_price);
  });

  test('Halaman detail harus menampilkan deskripsi produk', async ({ page }) => {
    const detailPage = await openBackpack(page);
    await expect(detailPage.description).toBeVisible();
    const text = await detailPage.description.textContent();
    expect(text?.length).toBeGreaterThan(20);
  });

  test('Add to cart dari halaman detail harus menampilkan badge @smoke', async ({ page }) => {
    const detailPage = await openBackpack(page);
    await detailPage.addToCart();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
  });

  test('Tombol back harus kembali ke halaman produk', async ({ page }) => {
    const detailPage = await openBackpack(page);
    await detailPage.backToProducts();
    await expect(page).toHaveURL(/.*inventory/);
    await expect(new InventoryPage(page).title).toHaveText('Products');
  });
});
