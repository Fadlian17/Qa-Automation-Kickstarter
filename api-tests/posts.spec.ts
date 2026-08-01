import { test, expect } from '../shared/fixtures';
import testData from '../shared/test-data/api.json';

/**
 * Studi kasus: API Core - Posts
 * Target: dummyjson.com (endpoints: /posts)
 * Docs: https://dummyjson.com/docs/posts
 */

const posts = testData.posts;

test.describe('API Core - Posts @regression', () => {
  test('GET /posts - harus return daftar posts @smoke', async ({ request }) => {
    const response = await request.get('/posts');

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('posts');
    expect(Array.isArray(body.posts)).toBe(true);
    expect(body.posts.length).toBeGreaterThan(0);
    expect(body).toHaveProperty('total');
    expect(body).toHaveProperty('limit');
  });

  test('GET /posts/1 - harus return data post valid', async ({ request }) => {
    const response = await request.get(`/posts/${posts.existing_id}`);

    expect(response.status()).toBe(200);
    const post = await response.json();
    expect(post).toHaveProperty('id');
    expect(post).toHaveProperty('title');
    expect(post).toHaveProperty('body');
    expect(post).toHaveProperty('userId');
    expect(post.id).toBe(posts.existing_id);
    expect(typeof post.title).toBe('string');
  });

  test('GET /posts/999999 - dengan ID tidak valid harus return 404', async ({ request }) => {
    const response = await request.get(`/posts/${posts.invalid_id}`);

    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body).toHaveProperty('message');
  });

  test('GET /posts/search?q=life - harus return hasil pencarian @smoke', async ({ request }) => {
    const response = await request.get(`/posts/search?q=${posts.search_term}`);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('posts');
    expect(Array.isArray(body.posts)).toBe(true);
    expect(body.posts.length).toBeGreaterThan(0);
  });

  test('GET /posts/user/1 - harus return posts milik user', async ({ request }) => {
    const response = await request.get(`/posts/user/${posts.user_id}`);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('posts');
    expect(Array.isArray(body.posts)).toBe(true);
    expect(body.posts.length).toBeGreaterThan(0);
    expect(body.posts[0].userId).toBe(posts.user_id);
  });

  test('POST /posts/add - harus bisa tambah post baru', async ({ request }) => {
    const response = await request.post('/posts/add', { data: posts.new_post });

    expect(response.status()).toBe(201);
    const post = await response.json();
    expect(post).toHaveProperty('id');
    expect(post.title).toBe(posts.new_post.title);
    expect(post.body).toBe(posts.new_post.body);
    expect(typeof post.id).toBe('number');
  });

  test('PUT /posts/1 - harus bisa update post @smoke @critical', async ({ request }) => {
    const response = await request.put(`/posts/${posts.existing_id}`, { data: posts.update_post });

    expect(response.status()).toBe(200);
    const post = await response.json();
    expect(post.id).toBe(posts.existing_id);
    expect(post.title).toBe(posts.update_post.title);
  });

  test('DELETE /posts/1 - harus bisa hapus post @smoke', async ({ request }) => {
    const response = await request.delete(`/posts/${posts.existing_id}`);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('isDeleted');
    expect(body.isDeleted).toBe(true);
  });
});
