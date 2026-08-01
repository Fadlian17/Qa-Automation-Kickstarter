import { test, expect } from '../shared/fixtures';
import testData from '../shared/test-data/users.json';

/**
 * Studi kasus: API Core - User Management (CRUD)
 * Target: dummyjson.com (endpoints: /users)
 * Mewakili: layer "API Core" - manajemen user
 * Docs: https://dummyjson.com/docs/users
 */

const users = testData.api.users;

test.describe('API Core - User Management @regression', () => {
  test('GET /users - harus return daftar user @smoke', async ({ request }) => {
    const response = await request.get('/users');

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('users');
    expect(Array.isArray(body.users)).toBe(true);
    expect(body.users.length).toBeGreaterThan(0);
    expect(body).toHaveProperty('total');
    expect(body).toHaveProperty('skip');
    expect(body).toHaveProperty('limit');

    const user = body.users[0];
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('firstName');
    expect(user).toHaveProperty('lastName');
    expect(user).toHaveProperty('email');
    expect(typeof user.id).toBe('number');
  });

  test('GET /users/1 - harus return data user valid', async ({ request }) => {
    const response = await request.get(`/users/${users.existing_id}`);

    expect(response.status()).toBe(200);
    const user = await response.json();
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('firstName');
    expect(user).toHaveProperty('lastName');
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('phone');
    expect(user.id).toBe(users.existing_id);
    expect(typeof user.email).toBe('string');
    expect(user.email).toContain('@');
  });

  test('GET /users/999999 - dengan ID tidak valid harus return 404', async ({ request }) => {
    const response = await request.get(`/users/${users.invalid_id}`);

    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body).toHaveProperty('message');
  });

  test('GET /users/search?q=emily - harus return hasil pencarian', async ({ request }) => {
    const response = await request.get('/users/search?q=emily');

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('users');
    expect(Array.isArray(body.users)).toBe(true);
    expect(body.users.length).toBeGreaterThan(0);
    expect(body).toHaveProperty('total');
  });

  test('POST /users/add - harus bisa tambah user baru @smoke', async ({ request }) => {
    const response = await request.post('/users/add', {
      data: users.new_user,
    });

    expect(response.status()).toBe(201);
    const user = await response.json();
    expect(user).toHaveProperty('id');
    expect(user.firstName).toBe(users.new_user.firstName);
    expect(user.lastName).toBe(users.new_user.lastName);
    expect(user.email).toBe(users.new_user.email);
    expect(typeof user.id).toBe('number');
  });

  test('PUT /users/1 - harus bisa update data user @smoke @critical', async ({ request }) => {
    const response = await request.put(`/users/${users.existing_id}`, {
      data: users.update_user,
    });

    expect(response.status()).toBe(200);
    const user = await response.json();
    expect(user.id).toBe(users.existing_id);
    expect(user.firstName).toBe(users.update_user.firstName);
    expect(user.lastName).toBe(users.update_user.lastName);
    expect(user.age).toBe(users.update_user.age);
  });

  test('PATCH /users/1 - harus bisa update sebagian field user', async ({ request }) => {
    const response = await request.patch(`/users/${users.existing_id}`, {
      data: users.partial_update,
    });

    expect(response.status()).toBe(200);
    const user = await response.json();
    expect(user.id).toBe(users.existing_id);
    expect(user.age).toBe(users.partial_update.age);
  });

  test('DELETE /users/1 - harus bisa hapus user @smoke @critical', async ({ request }) => {
    const response = await request.delete(`/users/${users.existing_id}`);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('isDeleted');
    expect(body.isDeleted).toBe(true);
    expect(body.id).toBe(users.existing_id);
  });

  test('GET /users - harus return user dengan pagination @smoke', async ({ request }) => {
    const response = await request.get(`/users?limit=${users.pagination.limit}&skip=${users.pagination.skip}`);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('users');
    expect(Array.isArray(body.users)).toBe(true);
    expect(body.users.length).toBeLessThanOrEqual(users.pagination.limit);
    expect(body.skip).toBe(users.pagination.skip);
    expect(body.limit).toBe(users.pagination.limit);
  });

  test('GET /users?select - harus return hanya field terpilih', async ({ request }) => {
    const response = await request.get(`/users?select=${users.select_fields}`);

    expect(response.status()).toBe(200);
    const body = await response.json();
    const user = body.users[0];
    const fields = users.select_fields.split(',');
    expect(user).toHaveProperty(fields[0]);
    expect(user).toHaveProperty(fields[1]);
    expect(user).not.toHaveProperty('address');
  });

  test('GET /users/filter - harus bisa filter user berdasarkan key/value @smoke', async ({ request }) => {
    const response = await request.get(
      `/users/filter?key=${users.filter.key}&value=${users.filter.value}`
    );

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('users');
    expect(Array.isArray(body.users)).toBe(true);
    expect(body.users.length).toBeGreaterThan(0);
    expect(body.users[0][users.filter.key]).toBe(users.filter.value);
  });

  test('GET /users/search - tanpa hasil harus return array kosong', async ({ request }) => {
    const response = await request.get(`/users/search?q=${users.no_result_term}`);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('users');
    expect(Array.isArray(body.users)).toBe(true);
    expect(body.users.length).toBe(0);
  });
});
