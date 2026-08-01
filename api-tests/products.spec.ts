import { test, expect } from '../shared/fixtures';
import testData from '../shared/test-data/api.json';

/**
 * Studi kasus: API Core - Product Catalog (lanjutan)
 * Target: dummyjson.com (endpoints: /products, /products/categories)
 * Docs: https://dummyjson.com/docs/products
 */

const products = testData.products;

test.describe('API Core - Product Catalog @regression', () => {
  test('GET /products - harus return daftar produk dengan pagination @smoke', async ({ request }) => {
    const response = await request.get(`/products?limit=${products.pagination.limit}&skip=${products.pagination.skip}`);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('products');
    expect(Array.isArray(body.products)).toBe(true);
    expect(body.products.length).toBeLessThanOrEqual(products.pagination.limit);
    expect(body.skip).toBe(products.pagination.skip);
    expect(body.limit).toBe(products.pagination.limit);
  });

  test('GET /products?select - harus return hanya field terpilih', async ({ request }) => {
    const response = await request.get(`/products?select=${products.select_fields}`);

    expect(response.status()).toBe(200);
    const body = await response.json();
    const product = body.products[0];
    const fields = products.select_fields.split(',');
    expect(product).toHaveProperty(fields[0]);
    expect(product).toHaveProperty(fields[1]);
    expect(product).not.toHaveProperty('description');
  });

  test('GET /products/categories - harus return daftar kategori', async ({ request }) => {
    const response = await request.get('/products/categories');

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
    expect(body[0]).toHaveProperty('slug');
    expect(body[0]).toHaveProperty('name');
  });

  test('GET /products/category/smartphones - harus return produk dari kategori @smoke', async ({ request }) => {
    const response = await request.get(`/products/category/${products.category}`);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('products');
    expect(Array.isArray(body.products)).toBe(true);
    expect(body.products.length).toBeGreaterThan(0);
    expect(body.products[0]).toHaveProperty('category');
    expect(body.products[0].category).toBe(products.category);
  });

  test('GET /products/category/unknown - kategori tidak dikenal harus return array kosong', async ({ request }) => {
    const response = await request.get(`/products/category/${products.unknown_category}`);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('products');
    expect(Array.isArray(body.products)).toBe(true);
    expect(body.products.length).toBe(0);
  });

  test('GET /products/search - tanpa hasil harus return array kosong', async ({ request }) => {
    const response = await request.get(`/products/search?q=${products.no_result_term}`);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('products');
    expect(Array.isArray(body.products)).toBe(true);
    expect(body.products.length).toBe(0);
  });

  test('POST /products/add - harus bisa tambah produk baru @smoke', async ({ request }) => {
    const response = await request.post('/products/add', { data: products.new_product });

    expect(response.status()).toBe(201);
    const product = await response.json();
    expect(product).toHaveProperty('id');
    expect(product.title).toBe(products.new_product.title);
    expect(product.price).toBe(products.new_product.price);
    expect(typeof product.id).toBe('number');
  });

  test('PUT /products/1 - harus bisa update produk @smoke @critical', async ({ request }) => {
    const response = await request.put(`/products/${products.existing_id}`, { data: products.update_product });

    expect(response.status()).toBe(200);
    const product = await response.json();
    expect(product.id).toBe(products.existing_id);
    expect(product.title).toBe(products.update_product.title);
  });

  test('PATCH /products/1 - harus bisa update sebagian field produk', async ({ request }) => {
    const response = await request.patch(`/products/${products.existing_id}`, { data: products.partial_update });

    expect(response.status()).toBe(200);
    const product = await response.json();
    expect(product.id).toBe(products.existing_id);
    expect(product.price).toBe(products.partial_update.price);
  });

  test('DELETE /products/1 - harus bisa hapus produk @smoke', async ({ request }) => {
    const response = await request.delete(`/products/${products.existing_id}`);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('isDeleted');
    expect(body.isDeleted).toBe(true);
  });

  test('PUT /products/999999 - dengan ID tidak valid harus return 404', async ({ request }) => {
    const response = await request.put(`/products/${products.invalid_id}`, { data: products.update_product });

    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body).toHaveProperty('message');
  });
});
