import { appTest as test, expect } from '../shared/fixtures/app';
import { LoginPage } from '../shared/pages/LoginPage';
import { InventoryPage } from '../shared/pages/InventoryPage';
import testData from '../shared/test-data/app.json';

/**
 * Studi kasus: End User App - Product Inventory (list, sort, add/remove)
 * Target: saucedemo.com
 * Docs: https://www.saucedemo.com
 */

const users = testData.users;
const products = testData.products;
const sort = testData.sort;

async function gotoInventory(page: import('@playwright/test').Page): Promise<InventoryPage> {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(users.standard.username, users.standard.password);
  return new InventoryPage(page);
}

test.describe('End User App - Product List @regression', () => {
  test('Halaman inventory harus menampilkan judul Products @smoke @critical', async ({ page }) => {
    const inventoryPage = await gotoInventory(page);
    await expect(inventoryPage.title).toHaveText('Products');
  });

  test('Halaman inventory harus menampilkan 6 produk @smoke', async ({ page }) => {
    const inventoryPage = await gotoInventory(page);
    await expect(inventoryPage.inventoryItems).toHaveCount(products.expected.total_count);
  });

  test('Halaman inventory harus menampilkan nama produk yang benar', async ({ page }) => {
    const inventoryPage = await gotoInventory(page);
    const names = await inventoryPage.getProductNames();
    expect(names).toContain(products.backpack);
    expect(names).toContain(products.bike_light);
    expect(names).toContain(products.fleece_jacket);
  });

  test('Halaman inventory harus menampilkan harga produk yang benar', async ({ page }) => {
    const inventoryPage = await gotoInventory(page);
    const prices = await inventoryPage.getProductPrices();
    expect(prices).toContain(products.expected.backpack_price);
    expect(prices).toContain(products.expected.bike_light_price);
  });
});

test.describe('End User App - Product Sort @regression', () => {
  test('Sort name A to Z harus mengurutkan nama naik @smoke', async ({ page }) => {
    const inventoryPage = await gotoInventory(page);
    await inventoryPage.sortBy(sort.az);
    const names = await inventoryPage.getProductNames();
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sorted);
    expect(names[0]).toBe(products.backpack);
  });

  test('Sort name Z to A harus mengurutkan nama turun', async ({ page }) => {
    const inventoryPage = await gotoInventory(page);
    await inventoryPage.sortBy(sort.za);
    const names = await inventoryPage.getProductNames();
    const sorted = [...names].sort((a, b) => b.localeCompare(a));
    expect(names).toEqual(sorted);
  });

  test('Sort price low to high harus mengurutkan harga naik @smoke', async ({ page }) => {
    const inventoryPage = await gotoInventory(page);
    await inventoryPage.sortBy(sort.lohi);
    const prices = await inventoryPage.getProductPrices();
    const nums = prices.map((p) => parseFloat(p.replace('$', '')));
    const sorted = [...nums].sort((a, b) => a - b);
    expect(nums).toEqual(sorted);
    expect(prices[0]).toBe(products.expected.cheapest);
  });

  test('Sort price high to low harus mengurutkan harga turun', async ({ page }) => {
    const inventoryPage = await gotoInventory(page);
    await inventoryPage.sortBy(sort.hilo);
    const prices = await inventoryPage.getProductPrices();
    const nums = prices.map((p) => parseFloat(p.replace('$', '')));
    const sorted = [...nums].sort((a, b) => b - a);
    expect(nums).toEqual(sorted);
    expect(prices[0]).toBe(products.expected.most_expensive);
  });
});

test.describe('End User App - Add to Cart from Inventory @regression', () => {
  test('Add produk ke cart harus menampilkan badge 1 @smoke @critical', async ({ page }) => {
    const inventoryPage = await gotoInventory(page);
    await inventoryPage.addToCart(products.backpack);
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('Add 2 produk ke cart harus menampilkan badge 2', async ({ page }) => {
    const inventoryPage = await gotoInventory(page);
    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.addToCart(products.bike_light);
    await expect(inventoryPage.cartBadge).toHaveText('2');
  });

  test('Remove produk dari cart harus mengurangi badge', async ({ page }) => {
    const inventoryPage = await gotoInventory(page);
    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.addToCart(products.bike_light);
    await inventoryPage.removeFromCart(products.backpack);
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('Remove semua produk harus menghilangkan badge @smoke', async ({ page }) => {
    const inventoryPage = await gotoInventory(page);
    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.removeFromCart(products.backpack);
    await expect(inventoryPage.cartBadge).toHaveCount(0);
  });
});
