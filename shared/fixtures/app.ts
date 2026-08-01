import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import type { Page } from '@playwright/test';

type AppFixtures = {
  appLogin: (username: string, password: string) => Promise<Page>;
};

export const appTest = base.extend<AppFixtures>({
  appLogin: async ({ page }, use) => {
    await use(async (username: string, password: string) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(username, password);
      return page;
    });
  },
});

export { expect };
