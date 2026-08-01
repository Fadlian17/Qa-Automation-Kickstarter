import { appTest as test, expect } from '../shared/fixtures/app';
import { LoginPage } from '../shared/pages/LoginPage';
import { InventoryPage } from '../shared/pages/InventoryPage';
import { CartPage } from '../shared/pages/CartPage';
import { CheckoutPage } from '../shared/pages/CheckoutPage';
import testData from '../shared/test-data/app.json';

/**
 * Studi kasus: End User App - Checkout (validation, summary, complete)
 * Target: saucedemo.com
 * Docs: https://www.saucedemo.com
 */

const users = testData.users;
const products = testData.products;
const checkout = testData.checkout;

async function gotoCheckoutStepOne(page: import('@playwright/test').Page) {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(users.standard.username, users.standard.password);
  const inventoryPage = new InventoryPage(page);
  await inventoryPage.addToCart(products.backpack);
  await inventoryPage.goToCart();
  const cartPage = new CartPage(page);
  await cartPage.goToCheckout();
  await expect(page).toHaveURL(/.*checkout-step-one/);
  return new CheckoutPage(page);
}

test.describe('End User App - Checkout Validation @regression', () => {
  test('Checkout tanpa first name harus menampilkan error @smoke', async ({ page }) => {
    const checkoutPage = await gotoCheckoutStepOne(page);
    await checkoutPage.fillCheckoutInfo(
      checkout.missing_first_name.firstName,
      checkout.missing_first_name.lastName,
      checkout.missing_first_name.postalCode
    );
    await expect(checkoutPage.errorMessage).toHaveText('Error: First Name is required');
  });

  test('Checkout tanpa last name harus menampilkan error', async ({ page }) => {
    const checkoutPage = await gotoCheckoutStepOne(page);
    await checkoutPage.fillCheckoutInfo(
      checkout.missing_last_name.firstName,
      checkout.missing_last_name.lastName,
      checkout.missing_last_name.postalCode
    );
    await expect(checkoutPage.errorMessage).toHaveText('Error: Last Name is required');
  });

  test('Checkout tanpa postal code harus menampilkan error', async ({ page }) => {
    const checkoutPage = await gotoCheckoutStepOne(page);
    await checkoutPage.fillCheckoutInfo(
      checkout.missing_postal_code.firstName,
      checkout.missing_postal_code.lastName,
      checkout.missing_postal_code.postalCode
    );
    await expect(checkoutPage.errorMessage).toHaveText('Error: Postal Code is required');
  });

  test('Data checkout valid harus lanjut ke step two @smoke @critical', async ({ page }) => {
    const checkoutPage = await gotoCheckoutStepOne(page);
    await checkoutPage.fillCheckoutInfo(
      checkout.valid_info.firstName,
      checkout.valid_info.lastName,
      checkout.valid_info.postalCode
    );
    await expect(page).toHaveURL(/.*checkout-step-two/);
  });

  test('Tombol cancel di step one harus kembali ke cart', async ({ page }) => {
    const checkoutPage = await gotoCheckoutStepOne(page);
    await checkoutPage.cancelCheckout();
    await expect(page).toHaveURL(/.*cart/);
  });
});

test.describe('End User App - Checkout Summary @regression', () => {
  test('Summary harus menampilkan info pembayaran', async ({ page }) => {
    const checkoutPage = await gotoCheckoutStepOne(page);
    await checkoutPage.fillCheckoutInfo(
      checkout.valid_info.firstName,
      checkout.valid_info.lastName,
      checkout.valid_info.postalCode
    );
    await expect(checkoutPage.paymentInfoValue).toHaveText('SauceCard #31337');
  });

  test('Summary harus menampilkan info pengiriman @smoke', async ({ page }) => {
    const checkoutPage = await gotoCheckoutStepOne(page);
    await checkoutPage.fillCheckoutInfo(
      checkout.valid_info.firstName,
      checkout.valid_info.lastName,
      checkout.valid_info.postalCode
    );
    await expect(checkoutPage.shippingInfoValue).toHaveText('Free Pony Express Delivery!');
  });

  test('Summary harus menampilkan subtotal yang benar', async ({ page }) => {
    const checkoutPage = await gotoCheckoutStepOne(page);
    await checkoutPage.fillCheckoutInfo(
      checkout.valid_info.firstName,
      checkout.valid_info.lastName,
      checkout.valid_info.postalCode
    );
    await expect(checkoutPage.subtotalLabel).toHaveText(`Item total: ${products.expected.backpack_price}`);
  });

  test('Summary harus menampilkan total yang dihitung dari subtotal + tax', async ({ page }) => {
    const checkoutPage = await gotoCheckoutStepOne(page);
    await checkoutPage.fillCheckoutInfo(
      checkout.valid_info.firstName,
      checkout.valid_info.lastName,
      checkout.valid_info.postalCode
    );
    await expect(checkoutPage.taxLabel).toBeVisible();
    await expect(checkoutPage.totalLabel).toBeVisible();
  });

  test('Finish harus menampilkan halaman order complete @smoke @critical', async ({ page }) => {
    const checkoutPage = await gotoCheckoutStepOne(page);
    await checkoutPage.fillCheckoutInfo(
      checkout.valid_info.firstName,
      checkout.valid_info.lastName,
      checkout.valid_info.postalCode
    );
    await checkoutPage.finishOrder();
    await expect(page).toHaveURL(/.*checkout-complete/);
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
  });

  test('Halaman complete harus menampilkan pesan sukses', async ({ page }) => {
    const checkoutPage = await gotoCheckoutStepOne(page);
    await checkoutPage.fillCheckoutInfo(
      checkout.valid_info.firstName,
      checkout.valid_info.lastName,
      checkout.valid_info.postalCode
    );
    await checkoutPage.finishOrder();
    await expect(checkoutPage.completeHeader).toBeVisible();
    await expect(checkoutPage.completeHeader).toContainText('Thank you');
  });

  test('Tombol cancel di step two harus kembali ke inventory', async ({ page }) => {
    const checkoutPage = await gotoCheckoutStepOne(page);
    await checkoutPage.fillCheckoutInfo(
      checkout.valid_info.firstName,
      checkout.valid_info.lastName,
      checkout.valid_info.postalCode
    );
    await checkoutPage.cancelCheckout();
    await expect(page).toHaveURL(/.*inventory/);
  });
});
