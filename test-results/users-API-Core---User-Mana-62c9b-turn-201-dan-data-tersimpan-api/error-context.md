# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api-tests/users.spec.ts >> API Core - User Management @regression >> POST create user - should return 201 dan data tersimpan
- Location: api-tests/users.spec.ts:35:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 201
Received: 401
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import testData from '../shared/test-data/users.json';
  3  | 
  4  | /**
  5  |  * Studi kasus: API Core
  6  |  * Target: reqres.in (public REST API demo)
  7  |  * Mewakili: layer "API Core" di produk kerja nyata
  8  |  */
  9  | 
  10 | test.describe('API Core - User Management @regression', () => {
  11 |   test('GET list user - should return page 2 dengan data user @smoke', async ({ request }) => {
  12 |     const response = await request.get('/api/users?page=2');
  13 |     expect(response.status()).toBe(200);
  14 | 
  15 |     const body = await response.json();
  16 |     expect(body.page).toBe(2);
  17 |     expect(body.data.length).toBeGreaterThan(0);
  18 |     expect(body.data[0]).toHaveProperty('email');
  19 |   });
  20 | 
  21 |   test('GET single user - should return data user valid', async ({ request }) => {
  22 |     const response = await request.get('/api/users/2');
  23 |     expect(response.status()).toBe(200);
  24 | 
  25 |     const body = await response.json();
  26 |     expect(body.data.id).toBe(2);
  27 |     expect(body.data).toHaveProperty('first_name');
  28 |   });
  29 | 
  30 |   test('GET single user - not found should return 404', async ({ request }) => {
  31 |     const response = await request.get('/api/users/23');
  32 |     expect(response.status()).toBe(404);
  33 |   });
  34 | 
  35 |   test('POST create user - should return 201 dan data tersimpan', async ({ request }) => {
  36 |     const newUser = { name: 'QA Tester', job: 'Automation Engineer' };
  37 |     const response = await request.post('/api/users', { data: newUser });
  38 | 
> 39 |     expect(response.status()).toBe(201);
     |                               ^ Error: expect(received).toBe(expected) // Object.is equality
  40 |     const body = await response.json();
  41 |     expect(body.name).toBe(newUser.name);
  42 |     expect(body.job).toBe(newUser.job);
  43 |     expect(body).toHaveProperty('id');
  44 |     expect(body).toHaveProperty('createdAt');
  45 |   });
  46 | });
  47 | 
  48 | test.describe('API Core - Authentication @regression', () => {
  49 |   test('POST login - dengan kredensial valid harus return token @smoke @critical', async ({ request }) => {
  50 |     const response = await request.post('/api/login', {
  51 |       data: testData.api.valid_login,
  52 |     });
  53 | 
  54 |     expect(response.status()).toBe(200);
  55 |     const body = await response.json();
  56 |     expect(body).toHaveProperty('token');
  57 |   });
  58 | 
  59 |   test('POST login - tanpa password harus return error 400', async ({ request }) => {
  60 |     const response = await request.post('/api/login', {
  61 |       data: testData.api.invalid_login,
  62 |     });
  63 | 
  64 |     expect(response.status()).toBe(400);
  65 |     const body = await response.json();
  66 |     expect(body.error).toBe('Missing password');
  67 |   });
  68 | });
  69 | 
```