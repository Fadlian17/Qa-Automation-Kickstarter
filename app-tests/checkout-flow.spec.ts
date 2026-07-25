import { test, expect } from '@playwright/test';
import { LoginPage } from '../shared/pages/LoginPage';
import { CheckoutPage } from '../shared/pages/CheckoutPage';
import testData from '../shared/test-data/users.json';

/**
 * Studi kasus: End User App
 * Target: saucedemo.com (situs demo resmi dari tim Sauce Labs untuk latihan automation)
 * Mewakili: layer "End User App" - login, cart, checkout (flow bisnis kritikal)
 */

test.describe('End User App - Login @regression', () => {
  test('Login dengan user valid harus masuk ke halaman produk @smoke @critical', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(testData.app.standard_user.username, testData.app.standard_user.password);

    await expect(page).toHaveURL(/.*inventory/);
    await expect(page.locator('.title')).toHaveText('Products');
  });

  test('Login dengan user yang di-lock harus menampilkan error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(testData.app.locked_out_user.username, testData.app.locked_out_user.password);

    await expect(loginPage.errorMessage).toContainText('locked out');
  });
});

test.describe('End User App - Checkout Flow @regression @critical', () => {
  test('User bisa menyelesaikan pembelian dari login sampai order selesai @smoke', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const checkoutPage = new CheckoutPage(page);

    // 1. Login
    await loginPage.goto();
    await loginPage.login(testData.app.standard_user.username, testData.app.standard_user.password);

    // 2. Tambah produk ke cart
    await checkoutPage.addProductToCart('Sauce Labs Backpack');
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

    // 3. Ke halaman cart lalu checkout
    await checkoutPage.goToCart();
    await expect(page).toHaveURL(/.*cart/);

    // 4. Isi data checkout
    await checkoutPage.fillCheckoutInfo('QA', 'Tester', '12345');
    await expect(page).toHaveURL(/.*checkout-step-two/);

    // 5. Selesaikan order
    await checkoutPage.finishOrder();
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
  });
});
