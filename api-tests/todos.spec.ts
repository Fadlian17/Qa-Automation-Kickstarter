import { test, expect } from '../shared/fixtures';
import testData from '../shared/test-data/api.json';

/**
 * Studi kasus: API Core - Todos
 * Target: dummyjson.com (endpoints: /todos)
 * Docs: https://dummyjson.com/docs/todos
 */

const todos = testData.todos;

test.describe('API Core - Todos @regression', () => {
  test('GET /todos - harus return daftar todos @smoke', async ({ request }) => {
    const response = await request.get('/todos');

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('todos');
    expect(Array.isArray(body.todos)).toBe(true);
    expect(body.todos.length).toBeGreaterThan(0);
    expect(body).toHaveProperty('total');
    expect(body).toHaveProperty('limit');
  });

  test('GET /todos/1 - harus return data todo valid', async ({ request }) => {
    const response = await request.get(`/todos/${todos.existing_id}`);

    expect(response.status()).toBe(200);
    const todo = await response.json();
    expect(todo).toHaveProperty('id');
    expect(todo).toHaveProperty('todo');
    expect(todo).toHaveProperty('completed');
    expect(todo).toHaveProperty('userId');
    expect(todo.id).toBe(todos.existing_id);
    expect(typeof todo.todo).toBe('string');
  });

  test('GET /todos/999999 - dengan ID tidak valid harus return 404', async ({ request }) => {
    const response = await request.get(`/todos/${todos.invalid_id}`);

    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body).toHaveProperty('message');
  });

  test('GET /todos/user/1 - harus return todos milik user @smoke', async ({ request }) => {
    const response = await request.get(`/todos/user/${todos.user_id}`);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('todos');
    expect(Array.isArray(body.todos)).toBe(true);
    expect(body.todos.length).toBeGreaterThan(0);
    expect(body.todos[0].userId).toBe(todos.user_id);
  });

  test('POST /todos/add - harus bisa tambah todo baru', async ({ request }) => {
    const response = await request.post('/todos/add', { data: todos.new_todo });

    expect(response.status()).toBe(201);
    const todo = await response.json();
    expect(todo).toHaveProperty('id');
    expect(todo.todo).toBe(todos.new_todo.todo);
    expect(todo.completed).toBe(todos.new_todo.completed);
    expect(typeof todo.id).toBe('number');
  });

  test('PUT /todos/1 - harus bisa update todo @smoke @critical', async ({ request }) => {
    const response = await request.put(`/todos/${todos.existing_id}`, { data: todos.update_todo });

    expect(response.status()).toBe(200);
    const todo = await response.json();
    expect(todo.id).toBe(todos.existing_id);
    expect(todo.completed).toBe(todos.update_todo.completed);
  });

  test('DELETE /todos/1 - harus bisa hapus todo @smoke', async ({ request }) => {
    const response = await request.delete(`/todos/${todos.existing_id}`);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('isDeleted');
    expect(body.isDeleted).toBe(true);
  });
});
