import { test as base, expect } from '@playwright/test';
import type { APIRequestContext, APIResponse } from '@playwright/test';

/**
 * Fixture request dengan auto-retry saat HTTP 429 (Too Many Requests).
 *
 * Latar belakang: target dummyjson.com adalah API publik yang menerapkan
 * rate limiting. Saat banyak test API berjalan paralel, sebagian request
 * bisa kena 429 yang sifatnya transient. Fixture ini me-retry request
 * dengan backoff sebelum test dianggap gagal, sehingga run stabil.
 */

const MAX_RETRIES = 3;
const RETRY_BASE_MS = 300;

const HTTP_METHODS = ['get', 'post', 'put', 'patch', 'delete', 'head', 'fetch'] as const;

function withRateLimitRetry(request: APIRequestContext): APIRequestContext {
  const wrapped = request as unknown as Record<string, unknown>;

  for (const method of HTTP_METHODS) {
    const original = request[method].bind(request) as (...args: unknown[]) => Promise<APIResponse>;
    wrapped[method] = async (...args: unknown[]): Promise<APIResponse> => {
      let response: APIResponse;
      for (let attempt = 0; ; attempt++) {
        response = await original(...args);
        if (response.status() !== 429 || attempt >= MAX_RETRIES) {
          return response;
        }
        await new Promise((resolve) => setTimeout(resolve, RETRY_BASE_MS * (attempt + 1)));
      }
    };
  }

  return request;
}

export const test = base.extend({
  request: async ({ request }, use) => {
    await use(withRateLimitRetry(request));
  },
});

export { expect };
