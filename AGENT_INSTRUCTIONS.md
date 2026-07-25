# Agent Instructions: QA Automation Demo Project

> File ini ditulis khusus supaya bisa diproses AI coding agent (contoh: opencode + ollama qwen).
> Berisi context, aturan, dan task list terstruktur. Jangan ubah bagian `## Project Context` dan `## Rules` kecuali diminta eksplisit oleh user.

---

## Project Context

- **Tipe project**: Test automation demo menggunakan Playwright + TypeScript
- **Tujuan**: Kickstarter/latihan sebelum automation diterapkan ke environment kerja nyata
- **Bahasa test**: TypeScript
- **Test framework**: `@playwright/test`
- **Struktur produk yang disimulasikan**: 3 layer terpisah (API Core, Back Office, End User App), meniru arsitektur produk kerja nyata

## Tech Stack

| Komponen | Tools |
|---|---|
| Test runner | Playwright Test |
| Bahasa | TypeScript |
| Package manager | npm |
| Pattern | Page Object Model (POM) |
| Data | JSON file terpusat, bukan hardcode |

## Folder Map

```
config/               -> konfigurasi environment (local.json, dev.json, staging.json)
api-tests/             -> file *.spec.ts untuk test API Core (target: reqres.in)
backoffice-tests/       -> file *.spec.ts untuk test Back Office (target: the-internet.herokuapp.com)
app-tests/              -> file *.spec.ts untuk test End User App (target: saucedemo.com)
shared/pages/            -> Page Object class (satu file per halaman/komponen)
shared/test-data/        -> data user/kredensial dalam format JSON
playwright.config.ts     -> config utama, berisi 3 "project": api, backoffice, app
```

## Rules (WAJIB diikuti agent saat generate/edit kode)

1. **Jangan hardcode data test** (username, password, URL) langsung di file `*.spec.ts`. Selalu ambil dari `shared/test-data/*.json`.
2. **Selector UI**: gunakan `data-test` / `data-testid` / `id` yang stabil. Hindari selector berbasis class CSS atau `nth-child` kalau ada alternatif yang lebih stabil.
3. **Setiap halaman baru yang di-test → buat Page Object baru** di `shared/pages/`, jangan tulis selector langsung di file spec.
4. **Tagging wajib** di setiap `test()` atau `test.describe()`:
   - `@smoke` → test kritikal, cepat, dijalankan tiap ada perubahan
   - `@regression` → test lengkap, dijalankan sebelum rilis
   - `@critical` → flow bisnis inti yang tidak boleh gagal (login, checkout, dsb)
5. **Satu file spec = satu fitur/flow**, jangan campur banyak fitur tidak berhubungan dalam satu file.
6. **Assertion harus spesifik** — hindari assertion generik seperti `expect(x).toBeTruthy()` kalau bisa dicek nilai yang lebih presisi.
7. **Tidak boleh ada `page.waitForTimeout()` (hard sleep)** kecuali benar-benar tidak ada alternatif — gunakan Playwright auto-waiting / `expect(...).toBeVisible()`, dll.
8. Setiap penambahan test baru, **update juga `README.md`** bagian struktur folder jika ada folder baru.

## Task List — Bisa Diminta ke Agent Secara Bertahap

Gunakan daftar ini sebagai prompt/task terpisah ke agent, jangan diminta sekaligus:

- [ ] **Task 1**: Jalankan `npm install` dan `npx playwright install`, laporkan jika ada error
- [ ] **Task 2**: Tambahkan test baru di `api-tests/` untuk endpoint `PUT /api/users/:id` (update user) dan `DELETE /api/users/:id`
- [ ] **Task 3**: Tambahkan test baru di `app-tests/` untuk skenario "remove product dari cart sebelum checkout"
- [ ] **Task 4**: Tambahkan Page Object baru untuk halaman `/dynamic_loading` di back office (the-internet.herokuapp.com) dan buat test untuk elemen yang muncul setelah loading
- [ ] **Task 5**: Buat file `.github/workflows/playwright.yml` untuk menjalankan `npm run test:smoke` otomatis setiap push
- [ ] **Task 6**: Refactor `config/*.json` menjadi satu module TypeScript (`config/index.ts`) yang membaca environment dari variabel `TEST_ENV`
- [ ] **Task 7**: Tambahkan custom fixture Playwright untuk auto-login (supaya test tidak perlu login manual berulang di tiap test)

## Definition of Done per Task

Setiap task dianggap selesai kalau:
1. Kode mengikuti semua `Rules` di atas
2. Test baru sudah punya minimal 1 tag (`@smoke` atau `@regression`)
3. Tidak ada data sensitif hardcode di file spec
4. File yang diubah/ditambah disebutkan eksplisit di akhir (list file path)

## Batasan Agent

- **Jangan** menjalankan test terhadap environment kerja nyata / production apapun — project ini hanya untuk target publik yang sudah ditentukan di atas (reqres.in, the-internet.herokuapp.com, saucedemo.com)
- **Jangan** menambah dependency baru tanpa menyebutkan alasannya
- **Jangan** menghapus tag `@critical` dari test checkout/login yang sudah ada
