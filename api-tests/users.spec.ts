import { test, expect } from '@playwright/test';
import testData from '../shared/test-data/users.json';

/**
 * Studi kasus: API Core - DummyJSON
 * Target: dummyjson.com (API endpoints: /auth, /products, /carts)
 * Mewakili: layer "API Core" - authentication, inventory, cart
 * Docs: https://dummyjson.com/docs
 */

test.describe('API Core - Authentication @regression', () => {
  test('POST /auth/login - dengan kredensial valid harus return token @smoke @critical', async ({ request }) => {
    const response = await request.post('/auth/login', {
      data: testData.api.valid_login,
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('username');
    expect(body).toHaveProperty('accessToken');
    expect(body).toHaveProperty('refreshToken');
    expect(body.username).toBe('emilys');
  });

  test('POST /auth/login - dengan kredensial invalid harus return 401', async ({ request }) => {
    const response = await request.post('/auth/login', {
      data: testData.api.invalid_login,
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toHaveProperty('message');
  });

  test('POST /auth/login - tanpa password harus return error', async ({ request }) => {
    const response = await request.post('/auth/login', {
      data: testData.api.missing_fields,
    });

    expect([400, 401]).toContain(response.status());
  });
});

test.describe('API Core - Inventory @regression', () => {
  test('GET /products - harus return daftar produk @smoke', async ({ request }) => {
    const response = await request.get('/products');

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('products');
    expect(Array.isArray(body.products)).toBe(true);
    expect(body.products.length).toBeGreaterThan(0);
    expect(body).toHaveProperty('total');
    expect(body).toHaveProperty('skip');
    expect(body).toHaveProperty('limit');

    const product = body.products[0];
    expect(product).toHaveProperty('id');
    expect(product).toHaveProperty('title');
    expect(product).toHaveProperty('price');
    expect(product).toHaveProperty('category');
    expect(typeof product.id).toBe('number');
    expect(typeof product.title).toBe('string');
    expect(typeof product.price).toBe('number');
  });

  test('GET /products/1 - harus return data produk valid', async ({ request }) => {
    const response = await request.get('/products/1');

    expect(response.status()).toBe(200);
    const product = await response.json();
    expect(product).toHaveProperty('id');
    expect(product).toHaveProperty('title');
    expect(product).toHaveProperty('price');
    expect(product).toHaveProperty('description');
    expect(product).toHaveProperty('category');
    expect(product.id).toBe(1);
    expect(typeof product.title).toBe('string');
    expect(typeof product.price).toBe('number');
    expect(product.price).toBeGreaterThan(0);
  });

  test('GET /products/999999 - dengan ID tidak valid harus return 404', async ({ request }) => {
    const response = await request.get('/products/999999');

    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body).toHaveProperty('message');
  });

  test('GET /products/search?q=phone - harus return hasil pencarian', async ({ request }) => {
    const response = await request.get('/products/search?q=phone');

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('products');
    expect(Array.isArray(body.products)).toBe(true);
    expect(body).toHaveProperty('total');
  });
});

test.describe('API Core - Cart @regression', () => {
  test('GET /carts/1 - harus return data cart valid', async ({ request }) => {
    const response = await request.get('/carts/1');

    expect(response.status()).toBe(200);
    const cart = await response.json();
    expect(cart).toHaveProperty('id');
    expect(cart).toHaveProperty('products');
    expect(cart).toHaveProperty('total');
    expect(cart).toHaveProperty('userId');
    expect(Array.isArray(cart.products)).toBe(true);
    expect(typeof cart.total).toBe('number');
  });

  test('POST /carts/add - harus bisa tambah cart baru', async ({ request }) => {
    const response = await request.post('/carts/add', {
      data: {
        userId: 1,
        products: [{ id: 144, quantity: 4 }],
      },
    });

    expect(response.status()).toBe(201);
    const cart = await response.json();
    expect(cart).toHaveProperty('id');
    expect(cart).toHaveProperty('products');
    expect(cart).toHaveProperty('total');
    expect(cart.products.length).toBeGreaterThan(0);
  });

  test('PUT /carts/1 - harus bisa update cart', async ({ request }) => {
    const response = await request.put('/carts/1', {
      data: {
        merge: true,
        products: [{ id: 1, quantity: 1 }],
      },
    });

    expect(response.status()).toBe(200);
    const cart = await response.json();
    expect(cart).toHaveProperty('products');
    expect(cart).toHaveProperty('total');
  });

  test('DELETE /carts/1 - harus bisa hapus cart', async ({ request }) => {
    const response = await request.delete('/carts/1');

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('isDeleted');
    expect(body.isDeleted).toBe(true);
  });
});
