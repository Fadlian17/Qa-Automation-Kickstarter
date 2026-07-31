# QA Automation Toolkit — Design Spec

- **Tanggal**: 2026-07-31
- **Status**: Disetujui (menunggu review user)
- **Project**: `qa-automation-demo` (Playwright + TypeScript)

## 1. Konteks

Project `qa-automation-demo` adalah kickstarter Playwright + TypeScript yang sudah memiliki implementasi pengujian untuk 3 layer produk: **API Core** (dummyjson), **Back Office** (the-internet.herokuapp.com), **End User App** (saucedemo.com). Implementasi saat ini sudah berjalan baik secara fungsional.

Rencana berikutnya: menjadikan ini sebuah **tool yang dipakai bersama oleh squad QA (8 orang)**. Tool ini harus menjamin tiga hal: visibilitas hasil & reporting, standardisasi & konsistensi antar penulis test, dan gate CI/CD otomatis.

Project ini sengaja dikerjakan sebagai **demo/latihan** — pola yang dimatangkan di sini nanti dibawa ke environment kerja nyata. Karena itu design harus berdiri di atas public demo sites dan tooling gratis (GitHub Actions + GitHub Pages), tanpa asumsi infra perusahaan.

## 2. Tujuan

1. **Visibilitas hasil & reporting** — semua orang di squad bisa melihat hasil run kapanpun lewat satu URL stabil, dengan history/trend untuk mendeteksi flaky test.
2. **Standardisasi & konsistensi** — 8 orang menulis test dengan pola yang sama. Pola di-enforce oleh tooling (typecheck, lint), bukan cuma dokumen.
3. **Gate CI/CD otomatis** — smoke test jadi gate di PR, regression terjadwal otomatis, report selalu ter-generate walau test gagal.

## 3. Bukan Tujuan (Non-Goals)

- Notifikasi ke Slack/Teams.
- Dashboard kustom / Grafana / ReportPortal.
- Generator/scaffold CLI untuk membuat test baru.
- Strategi cross-browser (cukup Desktop Chrome untuk demo).
- Manajemen secrets environment kerja nyata (hanya dicatat sebagai aturan di dokumen).

## 4. Assessment Kondisi Saat Ini

### Kekuatan yang dipertahankan

- POM (`shared/pages/`) dengan selector terpusat.
- Test data terpusat (`shared/test-data/`).
- Multi-project config (`api`, `backoffice`, `app`) dalam satu file.
- Tagging `@smoke` / `@regression` / `@critical`.
- Allure 3 sudah terintegrasi.
- Judul test sudah bermakna.

### Masalah yang akan diperbaiki

| Kategori | Masalah |
|---|---|
| Requirement | Belum ada CI. `config/*.json` mati — tidak di-import, baseURL hardcode di `playwright.config.ts`, isi config tidak konsisten dengan code (reqres.in vs dummyjson). Definisi tag tidak jelas. |
| Kode | Tidak ada `tsconfig.json`, tidak ada linter. POM tidak konsisten (locator inline di spec). Melanggar rule sendiri (password hardcode, assertion lemah). Dead code (`filePath`). Bug script `test:report` (`&&` mencegah report ter-generate saat test gagal). Test data JSON tidak typed. |
| Implementation | Login manual berulang di tiap test (tidak ada auth fixture). Password real di git. Satu browser saja. Dokumen untuk manusia tidak ada. |

## 5. Design

### 5.1 Arsitektur

```
qa-automation-demo/
├── playwright.config.ts          # baseURL di-drive dari config/index.ts (bukan hardcode)
├── tsconfig.json                 # strict mode + script `npm run typecheck`
├── eslint.config.mjs             # aturan gaya ter-enforce (lint di CI)
├── config/
│   └── index.ts                  # baca TEST_ENV (local/dev/staging), export typed config per layer
├── shared/
│   ├── fixtures/                 # auth fixtures: apiAuth, appLogin, adminLogin
│   ├── helpers/                  # API client wrapper + assertion helper
│   ├── pages/                    # POM (yang sudah ada + lokasi baru)
│   ├── test-data/                # users.ts typed (ganti raw JSON import)
│   └── types/                    # tipe TS bersama
├── .github/workflows/
│   ├── ci.yml                    # smoke di PR, regression terjadwal/manual, upload artifact
│   └── report.yml                # generate + deploy Allure ke GitHub Pages (dengan history)
├── docs/CONTRIBUTING.md          # standar untuk manusia
└── README.md                     # update: cara pakai tool untuk 8 QA
```

Prinsip: tiap unit kecil, satu tujuan, interface jelas. Config dipisah dari runner, fixtures dipisah dari test, data typed dipisah dari spec.

### 5.2 CI/CD Pipeline

**`ci.yml` — gate otomatis**
- Trigger: pull request ke `main` + push ke `main`.
- Job `typecheck-lint`: `npm run typecheck` + `npm run lint` wajib lolos.
- Job `smoke`: `npm run test:smoke` — gate PR. PR yang membuat smoke gagal tidak di-merge.
- Job `regression`: jalan otomatis tiap hari (schedule) + manual dispatch. Menjalankan semua test (`@regression`), upload `allure-results` + Playwright artifacts sebagai build artifact.
- Cache `node_modules` antar run.

**`report.yml` — visibilitas**
- Trigger: selesainya `regression` (success **atau** failure — report tetap harus ter-generate).
- Generate Allure dengan `--history-limit 50`, deploy ke GitHub Pages pakai action yang mempertahankan file lama (history/trend tersimpan antar run).
- Output: satu URL stabil untuk semua orang: `https://<user>.github.io/qa-automation-demo/`.

**Fix bug existing**: script `test:report` di `package.json` memakai `&&`, sehingga report tidak pernah ter-generate saat test gagal. Diubah menjadi generate terpisah (tidak bergantung pada exit code test).

### 5.3 Reporting & Visibilitas

- **Ringkasan halaman depan**: total pass/fail/flaky/broken, durasi, filter per layer (`api` / `backoffice` / `app`) via suite grouping otomatis.
- **Filter tagging**: `@smoke`, `@regression`, `@critical` sebagai label filter — ditata agar penempatannya konsisten (tag di `test()`, bukan hanya di `describe()`).
- **History/trend**: `--history-limit 50` → grafik trend 50 run terakhir. Kunci deteksi flaky test.
- **Trace & screenshot**: sudah dikonfigurasi (`trace: on-first-retry`, `screenshot: only-on-failure`). Kegagalan bisa diselidiki tanpa menjalankan ulang.
- **Enrichment minimal**: `allure.severity('critical')` hanya di test `@critical`.
- **Perilaku saat regression gagal**: report tetap ter-deploy lengkap dengan daftar test gagal + trace.

### 5.4 Standardisasi & Konsistensi

**Tooling (enforced otomatis):**
- `tsconfig.json` strict mode + `npm run typecheck`. Typecheck jadi langkah wajib di CI sebelum test.
- ESLint + prettier dengan rule yang meng-enforce pola: larang `page.locator` inline di file spec, larang hardcoded credential, larang `page.waitForTimeout`.
- Custom Playwright fixtures di `shared/fixtures/`:
  - `apiAuth` — login API sekali, kirim token ke header.
  - `appLogin` / `adminLogin` — auto-login sebelum test.
- Test data typed: `users.ts` dengan interface TS + helper accessor (`getUser('app', 'standard_user')`). Typo error di compile time.

**Pola wajib (didokumentasikan di `docs/CONTRIBUTING.md`):**
- Satu fitur = satu file spec.
- Selector stabil (`data-test*` / id); locator hanya di POM.
- Definisi tag yang diperjelas:
  - `@smoke` = kritikal & cepat (< 1 menit per test).
  - `@regression` = semua test.
  - `@critical` = flow bisnis inti.
- Struktur file baru: spec → POM → data → fixture.

**Fix inkonsistensi yang sudah ada:**
- Locator inline di `checkout-flow.spec.ts` dan `admin-panel.spec.ts` dipindah ke POM.
- Password hardcoded `'passwordSalah123'` dipindah ke test data.
- Assertion sort test yang lemah (`toBeTruthy`) diganti verifikasi aktual bahwa urutan baris berubah.
- Dead code `filePath` dihapus.

### 5.5 Verifikasi & Dokumen

**Bukti demo berhasil (Definition of Done):**
1. Setup lokal: `npm install` + `npx playwright install`; semua test hijau.
2. `npm run typecheck` + `npm run lint` lolos.
3. Push ke GitHub, PR dibuat → `ci.yml` jalan, smoke hijau di PR.
4. Trigger `regression` manual → report Allure ter-generate walau ada test gagal (bukti fix bug `&&`).
5. URL Pages berisi report dengan history/trend (setelah 2+ run).
6. Simulasi "QA baru": ikuti `docs/CONTRIBUTING.md` untuk menambah 1 test sederhana tanpa bertanya.

**Dokumen untuk manusia:**
- `docs/CONTRIBUTING.md` — standar penulisan test, definisi tagging, alur PR/gate, struktur folder.
- `README.md` — cara install, menjalankan per layer, melihat report Pages, link CI.
- `AGENT_INSTRUCTIONS.md` / `Allure_AGENT_INSTRUCTIONS.md` — diperbarui agar konsisten dengan design baru.

## 6. Risiko & Catatan

- Allure di Pages hanya menyimpan history selama halaman belum dibersihkan; action deploy yang dipilih harus mempertahankan file lama.
- `config/*.json` lama akan dihapus; nilainya dimigrasi ke `config/index.ts` yang dibaca oleh `playwright.config.ts`.
- Password pada demo ini bersifat publik; aturan untuk environment kerja nyata (credential tidak masuk git, pakai secret) dicatat di `CONTRIBUTING.md`.
