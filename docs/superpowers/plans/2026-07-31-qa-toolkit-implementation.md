# QA Automation Toolkit — Implementation Plan

- **Tanggal**: 2026-07-31
- **Status**: Siap dikerjakan
- **Sumber**: `docs/superpowers/specs/2026-07-31-qa-toolkit-design.md`

## Prasyarat

- Node.js >= 18 dan npm terinstall.
- Repo `qa-automation-demo` sudah ter-push ke GitHub (public repo agar Pages gratis).
- `package-lock.json` sudah ter-commit (sudah ter-track saat ini).

## Cara pakai plan ini

Kerjakan task secara berurutan. Setiap task memiliki: **Apa yang dikerjakan**, **File**, dan **Verifikasi**. Verifikasi wajib lolos sebelum lanjut ke task berikutnya. Beberapa task saling bergantung (ditandai dengan "membutuhkan Task X").

---

## Fase 0 — Fondasi

### Task 1: `tsconfig.json` + script typecheck
- **Apa**: Tambah `tsconfig.json` strict mode dan script `typecheck` di `package.json`. Typecheck hanya mengecek tipe, tidak emit (`noEmit: true`) karena Playwright men-transpile sendiri.
- **File**: `tsconfig.json` (baru), `package.json` (script `typecheck`).
- **Detail config**: `target: ES2022`, `module: ESNext`, `moduleResolution: Bundler`, `strict: true`, `noEmit: true`, `types: ["node", "@playwright/test"]`, `resolveJsonModule: true` (jembatan sementara sampai Task 5), `include: ["**/*.ts"]`, `exclude: ["node_modules", "playwright-report", "allure-report", "test-results"]`.
- **Verifikasi**: `npm run typecheck` lolos tanpa error.

### Task 2: Bersihkan `.gitignore`
- **Apa**: Tambah `test-results/` dan hapus entri duplikat/ambigu.
- **File**: `.gitignore`.
- **Verifikasi**: `git status` tidak menampilkan folder `test-results/`.

---

## Fase 1 — Tooling standar kode

### Task 3: Setup ESLint + Prettier
- **Apa**: Tambah devDependencies dan konfigurasi flat config ESLint dengan `typescript-eslint` + `eslint-plugin-playwright` + `prettier`/`eslint-config-prettier`. Tambah script `lint`, `lint:fix`, `format`.
- **File**: `eslint.config.mjs` (baru), `.prettierrc` (baru), `package.json` (script + devDependencies).
- **Detail rule**:
  - `recommended` dari typescript-eslint dan eslint-plugin-playwright.
  - `no-restricted-syntax`: larang `page.waitForTimeout(...)` di semua file.
  - `no-restricted-syntax` hanya di glob `**/*.spec.ts`: larang pemanggilan `page.locator(...)` inline (locator harus di POM).
  - Hardcoded credential: di-enforce via code review + aturan di CONTRIBUTING (catatan: rule ESLint kustom untuk ini terlalu kompleks untuk demo — dicatat sebagai penyederhanaan).
  - Abaikan file `playwright.config.ts` untuk rule spec-only.
- **Verifikasi**: `npm run lint` dan `npm run typecheck` berjalan tanpa crash.

### Task 4: Lint fix kode existing
- **Apa**: Jalankan `npm run lint:fix` lalu perbaiki manual sisa pelanggaran yang tidak auto-fixable (misal pemanggilan `page.locator` di spec — baru di-fix final di Task 8, di sini cukup pastikan tidak ada pelanggaran rule lain).
- **File**: file spec/POM yang ter-fix.
- **Verifikasi**: `npm run lint` + `npm run typecheck` hijau.

---

## Fase 2 — Data typed & config

### Task 5: Test data typed (`users.ts`)
- **Apa**: Buat `shared/test-data/users.ts` berisi interface + data + helper accessor `getUser(layer, key)`. Update import di 3 file spec dari `users.json` → `users.ts`. Tambahkan user baru `backoffice.invalid_admin` untuk Task 8. Hapus `users.json`.
- **File**: `shared/test-data/users.ts` (baru), `shared/test-data/users.json` (hapus), `api-tests/users.spec.ts`, `app-tests/checkout-flow.spec.ts`, `backoffice-tests/admin-panel.spec.ts`.
- **Verifikasi**: `npm run typecheck` hijau; semua spec memakai `getUser(...)`; tidak ada lagi import `users.json`.

### Task 6: Config terpusat (`config/index.ts`)
- **Apa**: Buat `config/index.ts` yang membaca `TEST_ENV` (default `local`) dan mengekspor baseURL per layer. `playwright.config.ts` memakai config ini untuk `baseURL` tiap project. Hapus `config/local.json`, `config/dev.json`, `config/staging.json`.
- **File**: `config/index.ts` (baru), `playwright.config.ts` (ubah), `config/*.json` (hapus).
- **Detail**: Semua env demo menunjuk ke situs publik yang sama (dummyjson / the-internet / saucedemo), karena env kerja nyata belum ada. Struktur siap diganti URL asli nanti.
- **Verifikasi**: `npm run typecheck` hijau; `npx playwright test --project=api --list` memakai baseURL dari config.

---

## Fase 3 — Fixtures & POM

### Task 7: Auth fixtures
- **Apa**: Buat `shared/fixtures/index.ts` dengan `test.extend`:
  - `apiAuth` — login ke `/auth/login`, ekspos token / request context ber-header.
  - `appLogin` — auto-login ke saucedemo, mulai dari halaman inventory.
  - `adminLogin` — auto-login ke back office, mulai dari halaman secure.
- **File**: `shared/fixtures/index.ts` (baru).
- **Verifikasi**: `npm run typecheck` hijau; fixture bisa dipakai tanpa menulis blok login ulang.

### Task 8: POM baru + perbaikan pelanggaran existing
- **Apa**:
  - Tambah `cartBadge` ke `CheckoutPage`.
  - Buat `ProductsPage` (locator `.title`) dan `DataTablePage` (tabel + `sortByLastNames()`), `FileUploadPage` (input file + tombol submit + hasil).
  - Pindah semua locator inline dari spec ke POM.
  - Ganti assertion sort yang lemah (`toBeTruthy`) dengan verifikasi aktual: ambil daftar last names, klik sort, ambil lagi, assert urutan berubah sesuai sort (naik/turun).
  - Hapus dead code `filePath` di spec upload.
  - Password `'passwordSalah123'` diganti `getUser('backoffice', 'invalid_admin')`.
- **File**: `shared/pages/ProductsPage.ts` (baru), `shared/pages/DataTablePage.ts` (baru), `shared/pages/FileUploadPage.ts` (baru), `shared/pages/CheckoutPage.ts` (ubah), `app-tests/checkout-flow.spec.ts`, `backoffice-tests/admin-panel.spec.ts`, `shared/test-data/users.ts` (tambah `invalid_admin`).
- **Verifikasi**: `npm run typecheck` + `npm run lint` hijau; `npx playwright test --project=app` dan `--project=backoffice` hijau; tidak ada `page.locator` di file spec.

---

## Fase 4 — CI/CD & Reporting

### Task 9: Fix script `test:report`
- **Apa**: Script `test:report` saat ini `playwright test && allure generate ...` — saat test gagal, report tidak ter-generate. Ubah agar generate tidak bergantung pada exit code test.
- **File**: `package.json`.
- **Detail**: `"test:report": "npm test || true && allure generate allure-results --clean && allure open"` (atau script terpisah `report:generate` yang dipakai CI juga).
- **Verifikasi**: `npm run test:report` menghasilkan report walaupun ada test gagal.

### Task 10: Workflow `ci.yml`
- **Apa**: GitHub Actions:
  - Job `typecheck-lint`: checkout, setup-node (cache npm), `npm ci`, `npm run typecheck`, `npm run lint`.
  - Job `smoke`: needs `typecheck-lint`, `npm run test:smoke`. Gate PR.
  - Job `regression`: triggered `schedule` (cron harian) + `workflow_dispatch`; `npm run test:regression`; upload artifact `allure-results` + Playwright report. Retries/workers sudah di-set di config untuk CI.
  - Trigger keseluruhan: `pull_request` + `push` ke `main`.
- **File**: `.github/workflows/ci.yml` (baru).
- **Verifikasi**: Push ke branch → workflow jalan; smoke hijau di PR.

### Task 11: Workflow `report.yml` + GitHub Pages
- **Apa**:
  - `report.yml` di-trigger `workflow_run` dari `ci.yml` (condition: regression selesai, success atau failure).
  - Download artifact `allure-results` dari run pemicu, `allure generate --history-limit 50` ke `allure-report/`, deploy ke branch `gh-pages` dengan `peaceiris/actions-gh-pages` + `keep_files: true` (agar history/trend tidak hilang antar run).
  - Butuh aksi user: aktifkan GitHub Pages di repo (source: `gh-pages` branch).
- **File**: `.github/workflows/report.yml` (baru).
- **Verifikasi**: Setelah 2+ run regression, URL Pages menampilkan trend/history.

---

## Fase 5 — Dokumentasi

### Task 12: `docs/CONTRIBUTING.md`
- **Apa**: Dokumen untuk 8 QA manusia: struktur folder, cara menulis test (spec → POM → data → fixture), definisi tag (`@smoke` kritikal & < 1 menit, `@regression` semua, `@critical` flow inti), alur PR/gate, aturan credential (jangan masukkan credential kerja nyata ke git), cara melihat report Pages.
- **File**: `docs/CONTRIBUTING.md` (baru).
- **Verifikasi**: Seorang QA baru bisa menambah 1 test sederhana hanya dengan dokumen ini.

### Task 13: Update README + dokumen agent
- **Apa**: Update `README.md` (cara pakai tool, link report Pages, alur CI), perbarui `AGENT_INSTRUCTIONS.md` dan `Allure_AGENT_INSTRUCTIONS.md` agar konsisten dengan design baru (task yang sudah selesai, script baru, catatan history).
- **File**: `README.md`, `AGENT_INSTRUCTIONS.md`, `Allure_AGENT_INSTRUCTIONS.md`.
- **Verifikasi**: Tidak ada bagian dokumen yang menyebut struktur/config yang sudah dihapus.

---

## Fase 6 — Verifikasi demo

### Task 14: Verifikasi lokal menyeluruh
- **Apa**: `npm install`, `npx playwright install`, `npm run typecheck`, `npm run lint`, `npm run test` — semuanya hijau. Jalankan `npm run test:report` untuk memastikan report ter-generate.
- **File**: tidak ada perubahan.
- **Verifikasi**: Semua perintah di atas sukses.

### Task 15: Bukti demo di CI (membutuhkan aksi user)
- **Apa**: Push ke GitHub, buat PR → cek smoke hijau di PR. Trigger `regression` manual (workflow_dispatch) → cek artifact. Jalankan regression sekali lagi → cek URL Pages punya history/trend. Buat 1 test rusak sementara → buktikan CI menolak dan report tetap ter-deploy.
- **File**: tidak ada perubahan (repo sudah ter-push).
- **Verifikasi**: PR gate jalan, report Pages live dengan history, behavior gagal-test tetap menghasilkan report.

---

## Penyederhanaan yang disengaja

- Hardcoded credential tidak di-enforce via rule ESLint kustom; cukup via code review + aturan di CONTRIBUTING.
- `report.yml` menggunakan action pihak ketiga `peaceiris/actions-gh-pages` (membutuhkan `keep_files: true` untuk mempertahankan history).

## Risiko

- **Flaky test di situs demo publik**: retries CI sudah `1`; history/trend Allure membuat flaky terlihat.
- **Pages setup**: user harus mengaktifkan GitHub Pages sekali di repo (langkah di Task 11).
- **Schedule tidak jalan di PR**: job `regression` hanya jalan di `main` (schedule/workflow_dispatch), bukan di PR.
