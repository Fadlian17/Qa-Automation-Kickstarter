# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api-tests/users.spec.ts >> API Core - Authentication @regression >> POST /auth/login - dengan kredensial invalid harus return 401
- Location: api-tests/users.spec.ts:26:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 401
Received: 400
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import testData from '../shared/test-data/users.json';
  3   | 
  4   | /**
  5   |  * Studi kasus: API Core - DummyJSON
  6   |  * Target: dummyjson.com (API endpoints: /auth, /products, /carts)
  7   |  * Mewakili: layer "API Core" - authentication, inventory, cart
  8   |  * Docs: https://dummyjson.com/docs
  9   |  */
  10  | 
  11  | test.describe('API Core - Authentication @regression', () => {
  12  |   test('POST /auth/login - dengan kredensial valid harus return token @smoke @critical', async ({ request }) => {
  13  |     const response = await request.post('/auth/login', {
  14  |       data: testData.api.valid_login,
  15  |     });
  16  | 
  17  |     expect(response.status()).toBe(200);
  18  |     const body = await response.json();
  19  |     expect(body).toHaveProperty('id');
  20  |     expect(body).toHaveProperty('username');
  21  |     expect(body).toHaveProperty('accessToken');
  22  |     expect(body).toHaveProperty('refreshToken');
  23  |     expect(body.username).toBe('emilys');
  24  |   });
  25  | 
  26  |   test('POST /auth/login - dengan kredensial invalid harus return 401', async ({ request }) => {
  27  |     const response = await request.post('/auth/login', {
  28  |       data: testData.api.invalid_login,
  29  |     });
  30  | 
> 31  |     expect(response.status()).toBe(401);
      |                               ^ Error: expect(received).toBe(expected) // Object.is equality
  32  |     const body = await response.json();
  33  |     expect(body).toHaveProperty('message');
  34  |   });
  35  | 
  36  |   test('POST /auth/login - tanpa password harus return error', async ({ request }) => {
  37  |     const response = await request.post('/auth/login', {
  38  |       data: testData.api.missing_fields,
  39  |     });
  40  | 
  41  |     expect([400, 401]).toContain(response.status());
  42  |   });
  43  | });
  44  | 
  45  | test.describe('API Core - Inventory @regression', () => {
  46  |   test('GET /products - harus return daftar produk @smoke', async ({ request }) => {
  47  |     const response = await request.get('/products');
  48  | 
  49  |     expect(response.status()).toBe(200);
  50  |     const body = await response.json();
  51  |     expect(body).toHaveProperty('products');
  52  |     expect(Array.isArray(body.products)).toBe(true);
  53  |     expect(body.products.length).toBeGreaterThan(0);
  54  |     expect(body).toHaveProperty('total');
  55  |     expect(body).toHaveProperty('skip');
  56  |     expect(body).toHaveProperty('limit');
  57  | 
  58  |     const product = body.products[0];
  59  |     expect(product).toHaveProperty('id');
  60  |     expect(product).toHaveProperty('title');
  61  |     expect(product).toHaveProperty('price');
  62  |     expect(product).toHaveProperty('category');
  63  |     expect(typeof product.id).toBe('number');
  64  |     expect(typeof product.title).toBe('string');
  65  |     expect(typeof product.price).toBe('number');
  66  |   });
  67  | 
  68  |   test('GET /products/1 - harus return data produk valid', async ({ request }) => {
  69  |     const response = await request.get('/products/1');
  70  | 
  71  |     expect(response.status()).toBe(200);
  72  |     const product = await response.json();
  73  |     expect(product).toHaveProperty('id');
  74  |     expect(product).toHaveProperty('title');
  75  |     expect(product).toHaveProperty('price');
  76  |     expect(product).toHaveProperty('description');
  77  |     expect(product).toHaveProperty('category');
  78  |     expect(product.id).toBe(1);
  79  |     expect(typeof product.title).toBe('string');
  80  |     expect(typeof product.price).toBe('number');
  81  |     expect(product.price).toBeGreaterThan(0);
  82  |   });
  83  | 
  84  |   test('GET /products/999999 - dengan ID tidak valid harus return 404', async ({ request }) => {
  85  |     const response = await request.get('/products/999999');
  86  | 
  87  |     expect(response.status()).toBe(404);
  88  |     const body = await response.json();
  89  |     expect(body).toHaveProperty('message');
  90  |   });
  91  | 
  92  |   test('GET /products/search?q=phone - harus return hasil pencarian', async ({ request }) => {
  93  |     const response = await request.get('/products/search?q=phone');
  94  | 
  95  |     expect(response.status()).toBe(200);
  96  |     const body = await response.json();
  97  |     expect(body).toHaveProperty('products');
  98  |     expect(Array.isArray(body.products)).toBe(true);
  99  |     expect(body).toHaveProperty('total');
  100 |   });
  101 | });
  102 | 
  103 | test.describe('API Core - Cart @regression', () => {
  104 |   test('GET /carts/1 - harus return data cart valid', async ({ request }) => {
  105 |     const response = await request.get('/carts/1');
  106 | 
  107 |     expect(response.status()).toBe(200);
  108 |     const cart = await response.json();
  109 |     expect(cart).toHaveProperty('id');
  110 |     expect(cart).toHaveProperty('products');
  111 |     expect(cart).toHaveProperty('total');
  112 |     expect(cart).toHaveProperty('userId');
  113 |     expect(Array.isArray(cart.products)).toBe(true);
  114 |     expect(typeof cart.total).toBe('number');
  115 |   });
  116 | 
  117 |   test('POST /carts/add - harus bisa tambah cart baru', async ({ request }) => {
  118 |     const response = await request.post('/carts/add', {
  119 |       data: {
  120 |         userId: 1,
  121 |         products: [{ id: 144, quantity: 4 }],
  122 |       },
  123 |     });
  124 | 
  125 |     expect(response.status()).toBe(200);
  126 |     const cart = await response.json();
  127 |     expect(cart).toHaveProperty('id');
  128 |     expect(cart).toHaveProperty('products');
  129 |     expect(cart).toHaveProperty('total');
  130 |     expect(cart.products.length).toBeGreaterThan(0);
  131 |   });
```