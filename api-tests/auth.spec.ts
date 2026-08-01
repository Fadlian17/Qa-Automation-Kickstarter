import { test, expect } from '../shared/fixtures';
import testData from '../shared/test-data/api.json';

/**
 * Studi kasus: API Core - Authentication (session & refresh token)
 * Target: dummyjson.com (endpoints: /auth/me, /auth/refresh)
 * Docs: https://dummyjson.com/docs/auth
 */

const auth = testData.auth;

test.describe('API Core - Auth Session @regression', () => {
  test('GET /auth/me - dengan token valid harus return profil user @smoke @critical', async ({ request }) => {
    const login = await request.post('/auth/login', { data: auth.valid_login });
    const { accessToken } = await login.json();

    const response = await request.get('/auth/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    expect(response.status()).toBe(200);
    const user = await response.json();
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('firstName');
    expect(user).toHaveProperty('email');
    expect(user.username).toBe(auth.valid_login.username);
    expect(typeof user.email).toBe('string');
  });

  test('GET /auth/me - tanpa token harus return 401', async ({ request }) => {
    const response = await request.get('/auth/me');

    expect(response.status()).toBe(401);
  });

  test('GET /auth/me - dengan token invalid harus return 401', async ({ request }) => {
    const response = await request.get('/auth/me', {
      headers: { Authorization: `Bearer ${auth.invalid_token}` },
    });

    expect(response.status()).toBe(401);
  });

  test('POST /auth/refresh - dengan refresh token valid harus return token baru @smoke', async ({ request }) => {
    const login = await request.post('/auth/login', { data: auth.valid_login });
    const { refreshToken } = await login.json();

    const response = await request.post('/auth/refresh', {
      data: { refreshToken, expiresInMins: 30 },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('accessToken');
    expect(body).toHaveProperty('refreshToken');
    expect(typeof body.accessToken).toBe('string');
    expect(body.accessToken.length).toBeGreaterThan(0);
  });

  test('POST /auth/refresh - dengan refresh token invalid harus return 403', async ({ request }) => {
    const response = await request.post('/auth/refresh', {
      data: { refreshToken: auth.invalid_refresh_token },
    });

    expect(response.status()).toBe(403);
    const body = await response.json();
    expect(body).toHaveProperty('message');
  });

  test('POST /auth/refresh - tanpa refresh token harus return error', async ({ request }) => {
    const response = await request.post('/auth/refresh', { data: {} });

    expect([400, 401, 403]).toContain(response.status());
  });
});
