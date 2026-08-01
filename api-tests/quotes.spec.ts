import { test, expect } from '../shared/fixtures';
import testData from '../shared/test-data/api.json';

/**
 * Studi kasus: API Core - Quotes
 * Target: dummyjson.com (endpoints: /quotes)
 * Docs: https://dummyjson.com/docs/quotes
 */

const quotes = testData.quotes;

test.describe('API Core - Quotes @regression', () => {
  test('GET /quotes - harus return daftar quotes @smoke', async ({ request }) => {
    const response = await request.get('/quotes');

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('quotes');
    expect(Array.isArray(body.quotes)).toBe(true);
    expect(body.quotes.length).toBeGreaterThan(0);
    expect(body).toHaveProperty('total');
    expect(body).toHaveProperty('limit');
  });

  test('GET /quotes/1 - harus return data quote valid', async ({ request }) => {
    const response = await request.get(`/quotes/${quotes.existing_id}`);

    expect(response.status()).toBe(200);
    const quote = await response.json();
    expect(quote).toHaveProperty('id');
    expect(quote).toHaveProperty('quote');
    expect(quote).toHaveProperty('author');
    expect(quote.id).toBe(quotes.existing_id);
    expect(typeof quote.quote).toBe('string');
    expect(quote.quote.length).toBeGreaterThan(0);
  });

  test('GET /quotes/random - harus return satu quote acak @smoke', async ({ request }) => {
    const response = await request.get('/quotes/random');

    expect(response.status()).toBe(200);
    const quote = await response.json();
    expect(quote).toHaveProperty('id');
    expect(quote).toHaveProperty('quote');
    expect(quote).toHaveProperty('author');
  });

  test('GET /quotes/999999 - dengan ID tidak valid harus return 404', async ({ request }) => {
    const response = await request.get(`/quotes/${quotes.invalid_id}`);

    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body).toHaveProperty('message');
  });
});
