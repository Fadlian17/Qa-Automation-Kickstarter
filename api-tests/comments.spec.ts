import { test, expect } from '../shared/fixtures';
import testData from '../shared/test-data/api.json';

/**
 * Studi kasus: API Core - Comments
 * Target: dummyjson.com (endpoints: /comments)
 * Docs: https://dummyjson.com/docs/comments
 */

const comments = testData.comments;

test.describe('API Core - Comments @regression', () => {
  test('GET /comments - harus return daftar comments @smoke', async ({ request }) => {
    const response = await request.get('/comments');

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('comments');
    expect(Array.isArray(body.comments)).toBe(true);
    expect(body.comments.length).toBeGreaterThan(0);
    expect(body).toHaveProperty('total');
    expect(body).toHaveProperty('limit');
  });

  test('GET /comments/1 - harus return data comment valid', async ({ request }) => {
    const response = await request.get(`/comments/${comments.existing_id}`);

    expect(response.status()).toBe(200);
    const comment = await response.json();
    expect(comment).toHaveProperty('id');
    expect(comment).toHaveProperty('body');
    expect(comment).toHaveProperty('postId');
    expect(comment).toHaveProperty('user');
    expect(comment.id).toBe(comments.existing_id);
    expect(typeof comment.body).toBe('string');
  });

  test('GET /comments/999999 - dengan ID tidak valid harus return 404', async ({ request }) => {
    const response = await request.get(`/comments/${comments.invalid_id}`);

    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body).toHaveProperty('message');
  });

  test('GET /comments/post/5 - harus return comments pada post tertentu @smoke', async ({ request }) => {
    const response = await request.get(`/comments/post/${comments.post_id}`);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('comments');
    expect(Array.isArray(body.comments)).toBe(true);
    expect(body.comments.length).toBeGreaterThan(0);
    expect(body.comments[0].postId).toBe(comments.post_id);
  });

  test('POST /comments/add - harus bisa tambah comment baru', async ({ request }) => {
    const response = await request.post('/comments/add', { data: comments.new_comment });

    expect(response.status()).toBe(201);
    const comment = await response.json();
    expect(comment).toHaveProperty('id');
    expect(comment.body).toBe(comments.new_comment.body);
    expect(comment.postId).toBe(comments.new_comment.postId);
    expect(typeof comment.id).toBe('number');
  });
});
