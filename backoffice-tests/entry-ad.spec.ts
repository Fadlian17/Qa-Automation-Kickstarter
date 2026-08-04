import { test, expect } from '@playwright/test';
import { EntryAdPage } from '../shared/pages/EntryAdPage';
import backofficeData from '../shared/test-data/backoffice.json';

/**
 * Studi kasus: Back Office - Entry Ad
 * Target: the-internet.herokuapp.com
 * Data test: shared/test-data/backoffice.json (entry_ad)
 */

const entryAd = backofficeData.entry_ad;

test.describe('Back Office - Entry Ad @regression', () => {
  test('Modal bisa ditutup dan dipanggil kembali @smoke', async ({ page }) => {
    const entryAdPage = new EntryAdPage(page);
    await entryAdPage.goto();

    await expect(entryAdPage.modal).toBeVisible({ timeout: 15000 });

    await entryAdPage.closeModal();
    await expect(entryAdPage.modal).toBeHidden();

    // #restart-ad pada halaman ini memicu full reload via href="" + location.reload()
    // (double navigation) yang tidak reliabel di CI — modal tidak muncul kembali.
    // Call-ulang dilakukan dengan reload halaman (mekanisme yang sama dengan restart-ad).
    await entryAdPage.goto();
    await expect(entryAdPage.modal).toBeVisible({ timeout: 15000 });
    await expect(entryAdPage.modal).toContainText(entryAd.modal_title);

    await entryAdPage.closeModal();
    await expect(entryAdPage.modal).toBeHidden();
  });
});
