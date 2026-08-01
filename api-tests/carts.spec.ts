import { test, expect } from '../shared/fixtures';
import testData from '../shared/test-data/api.json';

/**
 * Studi kasus: API Core - Cart Management (lanjutan)
 * Target: dummyjson.com (endpoints: /carts, /carts/user)
 * Docs: https://dummyjson.com/docs/carts
 */

const carts = testData.carts;

test.describe('API Core - Cart Management @regression', () => {
  test('GET /carts - harus return daftar cart @smoke', async ({ request }) => {
    const response = await request.get('/carts');

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('carts');
    expect(Array.isArray(body.carts)).toBe(true);
    expect(body.carts.length).toBeGreaterThan(0);
    expect(body).toHaveProperty('total');
    expect(body).toHaveProperty('limit');
  });

  test('GET /carts - harus return cart dengan pagination', async ({ request }) => {
    const response = await request.get('/carts?limit=2&skip=0');

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.carts.length).toBeLessThanOrEqual(2);
    expect(body.limit).toBe(2);
  });

  test('GET /carts/user/1 - harus return cart milik user @smoke', async ({ request }) => {
    const response = await request.get(`/carts/user/${carts.user_id}`);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('carts');
    expect(Array.isArray(body.carts)).toBe(true);
    expect(body.carts.length).toBeGreaterThan(0);
    expect(body.carts[0].userId).toBe(carts.user_id);
  });

  test('GET /carts/user/999 - user tidak punya cart harus return 404', async ({ request }) => {
    const response = await request.get(`/carts/user/${carts.invalid_user_id}`);

    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body).toHaveProperty('message');
  });

  test('GET /carts/999999 - dengan ID tidak valid harus return 404', async ({ request }) => {
    const response = await request.get(`/carts/${carts.invalid_id}`);

    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body).toHaveProperty('message');
  });

  test('POST /carts/add - dengan products kosong harus return 400', async ({ request }) => {
    const response = await request.post('/carts/add', { data: carts.empty_products_payload });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toHaveProperty('message');
  });

  test('PUT /carts/1 - dengan merge=false harus replace products', async ({ request }) => {
    const response = await request.put(`/carts/${carts.existing_id}`, { data: carts.update_merge_false });

    expect(response.status()).toBe(200);
    const cart = await response.json();
    expect(cart).toHaveProperty('products');
    expect(cart).toHaveProperty('total');
    expect(Array.isArray(cart.products)).toBe(true);
  });
});
