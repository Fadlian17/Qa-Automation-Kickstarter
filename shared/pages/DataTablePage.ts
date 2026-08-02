import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model - Sortable Data Tables (Back Office)
 * Halaman /tables pada the-internet.herokuapp.com
 */
export class DataTablePage {
  readonly page: Page;
  readonly table1: Locator;
  readonly table2: Locator;

  constructor(page: Page) {
    this.page = page;
    this.table1 = page.locator('#table1');
    this.table2 = page.locator('#table2');
  }

  async goto() {
    await this.page.goto('/tables');
  }

  async getRows(table: Locator): Promise<string[][]> {
    return table.locator('tbody tr').evaluateAll((rows) =>
      rows.map((row) =>
        Array.from(row.querySelectorAll('td')).map((td) => td.textContent?.trim() ?? ''),
      ),
    );
  }

  async getColumnValues(table: Locator, columnIndex: number): Promise<string[]> {
    const rows = await this.getRows(table);
    return rows.map((row) => row[columnIndex]);
  }

  async sortBy(table: Locator, headerText: string) {
    // tablesorter pada situs ini merespon event click via JS (bukan mouse event),
    // jadi gunakan dispatchEvent agar sort benar-benar terpicu.
    await table
      .locator('thead th')
      .filter({ hasText: headerText })
      .dispatchEvent('click');
  }
}
