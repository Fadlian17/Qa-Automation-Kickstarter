import { test, expect } from '../shared/fixtures';
import testData from '../shared/test-data/api.json';

/**
 * Studi kasus: API Core - Recipes
 * Target: dummyjson.com (endpoints: /recipes)
 * Docs: https://dummyjson.com/docs/recipes
 */

const recipes = testData.recipes;

test.describe('API Core - Recipes @regression', () => {
  test('GET /recipes - harus return daftar resep @smoke', async ({ request }) => {
    const response = await request.get('/recipes');

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('recipes');
    expect(Array.isArray(body.recipes)).toBe(true);
    expect(body.recipes.length).toBeGreaterThan(0);
    expect(body).toHaveProperty('total');
    expect(body).toHaveProperty('limit');
  });

  test('GET /recipes/1 - harus return data resep valid', async ({ request }) => {
    const response = await request.get(`/recipes/${recipes.existing_id}`);

    expect(response.status()).toBe(200);
    const recipe = await response.json();
    expect(recipe).toHaveProperty('id');
    expect(recipe).toHaveProperty('name');
    expect(recipe).toHaveProperty('ingredients');
    expect(recipe).toHaveProperty('instructions');
    expect(recipe.id).toBe(recipes.existing_id);
    expect(Array.isArray(recipe.ingredients)).toBe(true);
  });

  test('GET /recipes/999999 - dengan ID tidak valid harus return 404', async ({ request }) => {
    const response = await request.get(`/recipes/${recipes.invalid_id}`);

    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body).toHaveProperty('message');
  });

  test('GET /recipes/search?q=pizza - harus return hasil pencarian @smoke', async ({ request }) => {
    const response = await request.get(`/recipes/search?q=${recipes.search_term}`);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('recipes');
    expect(Array.isArray(body.recipes)).toBe(true);
    expect(body.recipes.length).toBeGreaterThan(0);
  });

  test('GET /recipes/tag/Spicy - harus return resep dengan tag @smoke', async ({ request }) => {
    const response = await request.get(`/recipes/tag/${recipes.tag}`);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('recipes');
    expect(Array.isArray(body.recipes)).toBe(true);
    expect(body.recipes.length).toBeGreaterThan(0);
  });

  test('GET /recipes/meal-type/dinner - harus return resep per tipe makan', async ({ request }) => {
    const response = await request.get(`/recipes/meal-type/${recipes.meal_type}`);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('recipes');
    expect(Array.isArray(body.recipes)).toBe(true);
    expect(body.recipes.length).toBeGreaterThan(0);
    expect(body.recipes[0]).toHaveProperty('mealType');
  });

  test('POST /recipes/add - harus bisa tambah resep baru', async ({ request }) => {
    const response = await request.post('/recipes/add', { data: recipes.new_recipe });

    expect(response.status()).toBe(200);
    const recipe = await response.json();
    expect(recipe).toHaveProperty('id');
    expect(recipe.name).toBe(recipes.new_recipe.name);
    expect(typeof recipe.id).toBe('number');
  });

  test('PUT /recipes/1 - harus bisa update resep @smoke @critical', async ({ request }) => {
    const response = await request.put(`/recipes/${recipes.existing_id}`, { data: recipes.update_recipe });

    expect(response.status()).toBe(200);
    const recipe = await response.json();
    expect(recipe.id).toBe(recipes.existing_id);
    expect(recipe.name).toBe(recipes.update_recipe.name);
  });

  test('DELETE /recipes/1 - harus bisa hapus resep @smoke', async ({ request }) => {
    const response = await request.delete(`/recipes/${recipes.existing_id}`);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('isDeleted');
    expect(body.isDeleted).toBe(true);
  });
});
