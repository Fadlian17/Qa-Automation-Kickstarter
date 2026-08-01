import { appTest as test, expect } from '../shared/fixtures/app';
import { LoginPage } from '../shared/pages/LoginPage';
import { InventoryPage } from '../shared/pages/InventoryPage';
import { CartPage } from '../shared/pages/CartPage';
import testData from '../shared/test-data/app.json';

/**
 * Studi kasus: End User App - Cart
 * Target: saucedemo.com
 * Docs: https://www.saucedemo.com
 */

const users = testData.users;
const products = testData.products;

async function gotoCart(page: import('@playwright/test').Page) {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(users.standard.username, users.standard.password);
  const inventoryPage = new InventoryPage(page);
  await inventoryPage.addToCart(products.backpack);
  await inventoryPage.goToCart();
  await expect(page).toHaveURL(/.*cart/);
  return new CartPage(page);
}

test.describe('End User App - Cart @regression', () => {
  test('Cart kosong tidak boleh menampilkan item @smoke', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.goToCart();
    const cartPage = new CartPage(page);
    await expect(cartPage.cartItems).toHaveCount(0);
  });

  test('Item yang di-add harus tampil di cart @smoke @critical', async ({ page }) => {
    const cartPage = await gotoCart(page);
    await expect(cartPage.cartItems).toHaveCount(1);
  });

  test('Nama item di cart harus sesuai produk yang dipilih', async ({ page }) => {
    const cartPage = await gotoCart(page);
    await expect(cartPage.itemNames).toHaveText([products.backpack]);
  });

  test('Harga item di cart harus sesuai produk', async ({ page }) => {
    const cartPage = await gotoCart(page);
    await expect(cartPage.itemPrices).toHaveText([products.expected.backpack_price]);
  });

  test('Quantity item di cart harus bernilai 1', async ({ page }) => {
    const cartPage = await gotoCart(page);
    await expect(cartPage.itemQuantities).toHaveText(['1']);
  });

  test('Remove item dari cart harus menghapus item @smoke', async ({ page }) => {
    const cartPage = await gotoCart(page);
    await cartPage.removeFromCart(products.backpack);
    await expect(cartPage.cartItems).toHaveCount(0);
  });

  test('Continue shopping harus kembali ke halaman produk @smoke', async ({ page }) => {
    const cartPage = await gotoCart(page);
    await cartPage.continueShopping();
    await expect(page).toHaveURL(/.*inventory/);
    await expect(new InventoryPage(page).title).toHaveText('Products');
  });

  test('Tombol checkout harus menuju halaman checkout step one @smoke @critical', async ({ page }) => {
    const cartPage = await gotoCart(page);
    await cartPage.goToCheckout();
    await expect(page).toHaveURL(/.*checkout-step-one/);
  });
});
