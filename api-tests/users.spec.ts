import { test, expect } from '@playwright/test';
import testData from '../shared/test-data/users.json';

/**
 * Studi kasus: API Core
 * Target: reqres.in (public REST API demo)
 * Mewakili: layer "API Core" di produk kerja nyata
 */

test.describe('API Core - User Management @regression', () => {
  test('GET list user - should return page 2 dengan data user @smoke', async ({ request }) => {
    const response = await request.get('/api/users?page=2');
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.page).toBe(2);
    expect(body.data.length).toBeGreaterThan(0);
    expect(body.data[0]).toHaveProperty('email');
  });

  test('GET single user - should return data user valid', async ({ request }) => {
    const response = await request.get('/api/users/2');
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.data.id).toBe(2);
    expect(body.data).toHaveProperty('first_name');
  });

  test('GET single user - not found should return 404', async ({ request }) => {
    const response = await request.get('/api/users/23');
    expect(response.status()).toBe(404);
  });

  test('POST create user - should return 201 dan data tersimpan', async ({ request }) => {
    const newUser = { name: 'QA Tester', job: 'Automation Engineer' };
    const response = await request.post('/api/users', { data: newUser });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.name).toBe(newUser.name);
    expect(body.job).toBe(newUser.job);
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('createdAt');
  });
});

test.describe('API Core - Authentication @regression', () => {
  test('POST login - dengan kredensial valid harus return token @smoke @critical', async ({ request }) => {
    const response = await request.post('/api/login', {
      data: testData.api.valid_login,
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('token');
  });

  test('POST login - tanpa password harus return error 400', async ({ request }) => {
    const response = await request.post('/api/login', {
      data: testData.api.invalid_login,
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toBe('Missing password');
  });
});
