# PDF Report (Rekap Test Run) — Design Spec

- **Tanggal**: 2026-08-02
- **Status**: Menunggu review user
- **Project**: `qa-automation-demo` (Playwright + TypeScript)

## 1. Konteks

Project `qa-automation-demo` adalah kickstarter Playwright + TypeScript dengan 3 project (layer produk): `api` (dummyjson), `backoffice` (the-internet.herokuapp.com), `app` (saucedemo.com). Reporting saat ini memakai Allure + HTML Playwright report.

Rencana ini menambah satu kompetensi baru: **menghasilkan output PDF berupa rekap hasil test run** ke dalam sebuah folder. PDF ditujukan untuk pembaca stakeholder/PM non-teknis — ringkas, bahasa Indonesia, tanpa detail teknis, siap dibagikan di meeting sebagai bukti pengujian.

Pendekatan yang disepakati: **JSON reporter + script terpisah** (bukan custom reporter). Test dan pembuatan PDF dipisah sehingga PDF bisa di-generate kapan pun dari hasil run mana pun (termasuk dari artifact CI).

## 2. Tujuan

1. Menghasilkan PDF rekap hasil test run (ringkasan + breakdown per layer + daftar test gagal) otomatis dari data Playwright.
2. Output tersimpan rapi dalam satu folder (`test-results/pdf/`).
3. Melatih kompetensi: HTML/CSS untuk reporting + PDF rendering via Chromium.
4. Dapat dijalankan sebagai langkah CI tanpa bergantung pada status lulus/gagal test.

## 3. Bukan Tujuan (Non-Goals)

- Menggantikan Allure / HTML Playwright report (fitur ini berdiri sendiri, tidak menyentuh setup yang sudah ada).
- PDF per test case / evidence screenshot.
- Notifikasi otomatis ke email/Slack setelah PDF dibuat.
- Kustomisasi desain yang mendalam (cukup template yang bersih dan print-friendly).

## 4. Assessment Kondisi Saat Ini

- `playwright.config.ts` memakai reporter `html`, `list`, `allure-playwright`. Belum ada JSON reporter.
- Tidak ada folder `test-results/pdf/`.
- Script npm `test:report` memakai `&&` (bug lama: report tidak ter-generate saat test gagal) — catatan dari spec sebelumnya, di luar lingkup ini.
- Belum ada `tsx` di devDependencies (dibutuhkan untuk menjalankan script TypeScript langsung).

## 5. Design

### 5.1 Alur Data

```
playwright test
   └─ reporter: json → test-results/report.json   (selalu ter-generate, walau ada test gagal)
        │
        ▼
npm run report:pdf
   └─ scripts/generate-pdf-report.ts
        ├─ baca test-results/report.json
        ├─ agregasi: total, pass/fail/skipped, durasi, per project (api/backoffice/app)
        ├─ render template HTML (bahasa Indonesia, CSS print-friendly)
        └─ cetak via Chromium (chromium.launch + page.pdf) → test-results/pdf/report-<timestamp>.pdf
```

- JSON reporter menangkap **semua project sekaligus** (satu file, field `projectName` per test) → PDF dapat memuat breakdown per layer.
- Karena PDF di-generate dari file, script bisa jalan setelah run berapa pun, dan dari hasil yang di-upload dari CI.

### 5.2 Komponen

| Unit | Tanggung jawab |
|---|---|
| `playwright.config.ts` | tambah `['json', { outputFile: 'test-results/report.json' }]` pada `reporter[]` |
| `scripts/generate-pdf-report.ts` | orkestrasi: baca JSON → agregasi → render → cetak |
| `shared/pdf/template.ts` | render HTML string dari data agregat (layout + CSS) |
| `shared/pdf/aggregate.ts` | pure function: JSON → `{ totals, perProject[], failures[] }` |
| `test-results/pdf/` | folder output PDF |

Prinsip desain mengikuti pola yang ada: unit kecil, satu tujuan, interface jelas; pure function dipisah agar mudah di-test.

### 5.3 Isi PDF

- **Header:** nama proyek, tanggal/jam run, durasi total.
- **Ringkasan kartu:** Total, Passed, Failed, Skipped (+ persentase pass).
- **Breakdown per layer:** tabel `api` / `backoffice` / `app` — jumlah test, pass, fail, durasi.
- **Daftar test gagal:** nama test, project, file:line, error singkat (jika ada).
- **Footer:** `test-results/report.json` sebagai sumber data.

### 5.4 Skema Output & Konvensi File

```
test-results/pdf/
└── report-20260802-140500.pdf
```

- Nama file: `report-<YYYYMMDD-HHmmss>.pdf`, disimpan di `test-results/pdf/`.
- Argumen CLI script:
  - `--project api|backoffice|app` → PDF khusus satu layer (filter field `projectName`).
  - tanpa argumen → semua project dalam satu PDF.
  - `--input <path>` → sumber data selain `test-results/report.json` (default).

### 5.5 Error Handling

- **JSON reporter hilang / belum pernah run:** script berhenti dengan pesan jelas *"tidak ada test-results/report.json, jalankan npm test dulu"* (exit code 1).
- **File JSON valid tapi nol test:** tetap generate PDF dengan ringkasan kosong + catatan "belum ada hasil".
- **Chromium gagal launch:** pesan error dari Playwright diteruskan; PDF tidak dibuat setengah jadi.
- Exit code script = 0 bila sukses, 1 bila gagal → dapat dipakai sebagai step CI.

### 5.6 Testing & Dokumen

- **Unit test `aggregate.ts`** (tanpa browser, cepat): mock JSON → cek agregasi (total, per-project, daftar gagal). Letak: `tests/pdf-aggregate.spec.ts`.
- **Verifikasi manual:** `npm test` lalu `npm run report:pdf` → buka PDF hasilnya.
- **`package.json`:** tambah devDependency `tsx` dan script `report:pdf` → `tsx scripts/generate-pdf-report.ts`.
- **`README.md`:** tambah bagian "Membuat Laporan PDF" — cara pakai, argumen CLI, lokasi output.
- Tidak menyentuh Allure/CI yang sudah ada.

## 6. Risiko & Catatan

- Format JSON Playwright bisa berubah antar versi — parsing cukup pada field yang stabil (`projectName`, `status`, `duration`, `title`, `error`).
- Menambah JSON reporter menambah file output kecil di tiap run (ringan, tidak jadi masalah).
- Desain PDF dibatasi pada template yang bersih; kustomisasi branding bisa ditambah belakangan tanpa mengubah alur.
