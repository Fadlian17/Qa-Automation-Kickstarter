# QA Automation Demo — Kickstarter Project

Project demo Playwright untuk latihan sebelum implementasi automation di environment kerja nyata.
Struktur project ini sengaja dibuat **mirip** dengan setup yang akan dipakai di pekerjaan (API Core, Back Office, End User App, multi-environment) tapi menggunakan situs demo publik yang aman untuk latihan.
n
## Studi Kasus

| Layer | Target | Representasi |
|---|---|---|
| API Core | API Source https://dummyjson.com/ | Dummy REST API (login, Cart, Checkout) |
| Back Office | https://the-internet.herokuapp.com | Admin login, tabel data, upload file |
| End User App | https://www.saucedemo.com | Login, cart, checkout flow |

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
npm run report               # buka laporan hasil test terakhir
```

## Struktur Folder

```
qa-automation-demo/
├── config/                  # config per environment (local/dev/staging)
├── api-tests/               # test API Core
├── backoffice-tests/        # test Back Office
├── app-tests/                # test End User App
├── shared/
│   ├── pages/                # Page Object Model
│   ├── test-data/            # data test terpusat (tidak hardcode di test)
│   └── apidata/              # API Collection
├── playwright.config.ts
└── package.json
```

## Konsep yang Dilatih di Project Ini

1. **Page Object Model** — selector terpusat di `shared/pages/`, bukan tersebar di tiap test
2. **Test data terpisah** — semua kredensial ada di `shared/test-data/users.json`
3. **Tagging** — `@smoke`, `@regression`, `@critical` untuk eksekusi parsial (mirip gate dev/staging/prod)
4. **Multi-project config** — `api`, `backoffice`, `app` dipisah tapi jalan dari satu config
5. **API + UI dalam satu framework** — tidak perlu tool berbeda untuk API dan UI test

## Langkah Setelah Demo Ini Stabil

1. Push project ini ke repo Git pribadi, coba jalankan via GitHub Actions
2. Ganti `baseURL` di `playwright.config.ts` dan file di `config/` dengan URL environment dev perusahaan
3. Tulis ulang `shared/pages/` sesuai selector produk asli
4. Terapkan gate: smoke test di dev, full regression di staging, smoke read-only di prod

Lihat juga `AGENT_INSTRUCTIONS.md` untuk instruksi terstruktur yang bisa diproses AI coding agent (opencode/ollama).
