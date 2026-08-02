# QA Automation Demo — Kickstarter Project

Project demo Playwright untuk latihan sebelum implementasi automation di environment kerja nyata.
Struktur project ini sengaja dibuat **mirip** dengan setup yang akan dipakai di pekerjaan (API Core, Back Office, End User App, multi-environment) tapi menggunakan situs demo publik yang aman untuk latihan.

## Studi Kasus

| Layer | Target | Representasi |
|---|---|---|
| API Core | https://dummyjson.com | Dummy REST API (auth, users, products, carts, posts, dll.) |
| Back Office | https://the-internet.herokuapp.com | Dashboard admin: login, tabel data, upload, form, widget interaktif |
| End User App | https://www.saucedemo.com | Login, cart, checkout flow |

## Cakupan Test

| Layer | Jumlah Test | File Spec |
|---|---|---|
| API Core | 80 | `api-tests/` (10 file) |
| Back Office | 74 | `backoffice-tests/` (25 file) |
| End User App | 54 | `app-tests/` (7 file) |
| **Total** | **208** | **42 file** |

Setiap skenario dipetakan ke test data dan expected result di `docs/test-data-mapping-*.md`.

## Setup

```bash
npm install
npx playwright install   # download browser (Chromium, Firefox, WebKit)
```

## Menjalankan Test

```bash
npm test                    # semua test, semua layer
npm run test:api            # API core saja
npm run test:backoffice     # back office saja
npm run test:app            # end user app saja
npm run test:smoke          # hanya test yang di-tag @smoke
npm run test:regression     # hanya test yang di-tag @regression
npm run test:headed         # jalankan dengan browser terlihat (bukan headless)
npm run report              # buka laporan hasil test terakhir
```

Contoh dengan environment staging:

```bash
TEST_ENV=staging npm test
TEST_ENV=dev npx playwright test --project=api
```

## Struktur Folder

```
qa-automation-demo/
├── config/                  # config per environment (local/dev/staging)
├── api-tests/               # test API Core (dummyjson.com)
├── backoffice-tests/        # test Back Office (the-internet.herokuapp.com)
├── app-tests/               # test End User App (saucedemo.com)
├── shared/
│   ├── pages/               # Page Object Model (satu file per halaman/komponen)
│   ├── fixtures/            # custom fixture Playwright (misal auto-login app)
│   ├── test-data/           # data test terpusat (users.json, api.json, app.json, backoffice.json)
│   └── apidata/             # API Collection
├── docs/                    # dokumentasi mapping skenario test → test data
├── playwright.config.ts     # config utama, berisi 3 "project": api, backoffice, app
└── package.json
```

## Test Data Terpusat

Data test tidak di-hardcode di file spec, melainkan disimpan per layer:

| File | Isi |
|---|---|
| `shared/test-data/users.json` | Kredensial user semua layer (app, backoffice, api) |
| `shared/test-data/api.json` | Payload & skenario API (auth, products, carts, recipes, dll.) |
| `shared/test-data/app.json` | User, produk, sort, checkout, pesan error (saucedemo) |
| `shared/test-data/backoffice.json` | Data dashboard back office (tabel, form, alert, dll.) |

Dokumentasi mapping lengkap ada di:
- `docs/test-data-mapping.md` — API Core
- `docs/test-data-mapping-app.md` — End User App
- `docs/test-data-mapping-backoffice.md` — Back Office

## Cakupan Back Office Dashboard

Modul yang diotomatisasi di `backoffice-tests/` (target the-internet.herokuapp.com):

- **Dashboard & Navigasi** — judul halaman, daftar modul, klik navigasi
- **Auth** — login valid/invalid, field kosong, logout
- **Data** — sortable table, format data, drag & drop
- **Form & Widget** — checkboxes, dropdown, inputs, slider, add/remove elements
- **Interaksi** — hover, key presses, dynamic controls/loading, context menu
- **Alerts & Popup** — JS alerts, multiple windows, entry ad, notification message
- **Frame** — nested frames, iframe (WYSIWYG)
- **Lainnya** — status codes, redirect, broken images, shadow DOM, infinite scroll

## Konsep yang Dilatih di Project Ini

1. **Page Object Model** — selector terpusat di `shared/pages/`, bukan tersebar di tiap test
2. **Test data terpisah** — semua kredensial & payload ada di `shared/test-data/*.json`
3. **Tagging** — `@smoke`, `@regression`, `@critical` untuk eksekusi parsial (mirip gate dev/staging/prod)
4. **Multi-project config** — `api`, `backoffice`, `app` dipisah tapi jalan dari satu config
5. **API + UI dalam satu framework** — tidak perlu tool berbeda untuk API dan UI test
6. **Custom fixture** — login berulang dibungkus fixture agar test fokus pada skenario
7. **Multi-environment** — base URL per environment via `TEST_ENV` (`config/index.ts`)

## Langkah Setelah Demo Ini Stabil

1. Push project ini ke repo Git pribadi, coba jalankan via GitHub Actions
2. Ganti `baseURL` di `playwright.config.ts` dan file di `config/` dengan URL environment dev perusahaan
3. Tulis ulang `shared/pages/` sesuai selector produk asli
4. Terapkan gate: smoke test di dev, full regression di staging, smoke read-only di prod

Lihat juga `AGENT_INSTRUCTIONS.md` untuk instruksi terstruktur yang bisa diproses AI coding agent (opencode/ollama).
