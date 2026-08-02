# Gap Analysis Test Suite terhadap ISTQB CTFL v4.0 (2023)

- **Tanggal**: 2026-08-02
- **Proyek**: `qa-automation-demo` (Playwright + TypeScript)
- **Standar acuan**: ISTQB Certified Tester Foundation Level v4.0 (2023)
- **Cakupan**: 213 test case (API 80, App 54, Back Office 74, Unit 5)
- **Bersifat**: analisis saja — tidak mengubah kode

## 1. Ringkasan Eksekutif

Suite ini sudah sangat kuat pada **Equivalence Partitioning** dan **Use Case Testing** — mayoritas negatif case (invalid, empty, tidak ada) sudah ter-cover di semua layer. Kesenjangan utama:

1. **Boundary Value Analysis (BVA) belum ada** di seluruh suite — tidak ada test batas min/max pada input.
2. **Decision Table belum formal** — checkout field-kosong diuji per-field, bukan kombinasi kondisi.
3. **State Transition baru sebagian** — alur cart/dynamic-controls ada, tapi tidak sebagai model state formal.
4. **Ada redundansi** — `api-tests/users.spec.ts` memuat test Cart & Inventory yang duplikat dengan file lain.
5. **Asersi sebagian lemah** dan **tagging tidak konsisten**.

### Matriks skor per layer

| Teknik CTFL | API | App | Back Office | Unit |
|---|---|---|---|---|
| Equivalence Partitioning | ✓ | ✓ | ✓ | ✓ |
| Boundary Value Analysis | ✗ | ✗ | ✗ | n/a |
| Decision Table | ✗ | ◐ | ✗ | ✗ |
| State Transition | ◐ | ◐ | ◐ | ✗ |
| Use Case | ✓ | ✓ | ◐ | ✗ |
| Error Guessing | ✓ | ✓ | ✓ | ✗ |
| Exploratory / Checklist | ✗ | ✗ | ✗ | ✗ |
| White-box (branch) | ✗ | ✗ | ✗ | ✓ |

| Test Type | API | App | Back Office |
|---|---|---|---|
| Functional | ✓ | ✓ | ✓ |
| Non-functional (perf/usability/security) | ✗ | ◐ | ◐ |
| Change-related (regression) | ✓ | ✓ | ✓ |
| Confirmation (re-test setelah fix) | ✗ | ✗ | ✗ |

## 2. Assessment per Layer

### 2.1 API Core (80 test)

**Cakupan teknik:**

| Teknik | Skor | Bukti |
|---|---|---|
| EP | ✓ | kredensial valid/invalid, ID valid vs `999999`→404, kategori dikenal vs unknown, search ada vs tanpa hasil |
| BVA | ✗ | tidak ada test batas (mis. pagination `limit=0`, `limit` maksimal, ID di boundary) |
| Decision Table | ✗ | tidak ada (endpoint `carts/add` empty→400 adalah satu-satunya pendekatan) |
| State Transition | ◐ | CRUD sebagian (POST→GET→PUT→DELETE) tapi tidak formal berurutan |
| Use Case | ✓ | login → ambil data → operasi, flow end-to-end tiap resource |
| Error Guessing | ✓ | token invalid, ID tidak valid, merge=false, rate-limit retry |
| White-box | ✗ | tidak ada coverage tooling / test logika internal |

**Tambah (prioritas):**
- **P0 — BVA pagination:** `limit=0`, `limit=1`, `limit` besar, `skip` di luar range, `limit` negatif/string.
- **P1 — Decision table `carts/add`:** kombinasi `products: []` vs `products` berisi item dengan `quantity: 0` vs valid.

**Kurangi (prioritas):**
- **P0 — Redundansi `users.spec.ts`:** blok `API Core - Inventory` (GET/PUT/DELETE products) dan `API Core - Cart` (CRUD cart) duplikat dari `products.spec.ts` / `carts.spec.ts`. Test ini seharusnya digabung ke file yang tepat atau dihapus.

**Improve:**
- **P1 — Asersi schema:** verifikasi tipe field (mis. `typeof id === 'number'`) + validasi struktur, bukan hanya status code.
- **P1 — Konsistensi tagging:** `@smoke` dipakai untuk test "happy path + kritikal", beberapa di antaranya belum tentu smoke-eligible.
- **P1 — Satu file = satu fitur:** file `users.spec.ts` berisi banyak fitur (auth, inventory, cart) — pisahkan sesuai domain.

### 2.2 End User App (54 test)

**Cakupan teknik:**

| Teknik | Skor | Bukti |
|---|---|---|
| EP | ✓ | 8 kelas user (valid, locked, problem, visual, error, performance_glitch), field login kosong, 4 opsi sort |
| BVA | ✗ | tidak ada test batas (postal code panjang, qty maksimal) |
| Decision Table | ◐ | checkout: first/last/postal kosong diuji terpisah (3 test), kombinasi multi-field belum |
| State Transition | ◐ | cart: empty → add → remove → empty; flow checkout: step1→step2→complete ada tapi tidak sebagai model |
| Use Case | ✓ | `checkout-flow` login → beli → order complete (end-to-end) |
| Error Guessing | ✓ | locked_out_user, error_user, performance_glitch_user, cart kosong |

**Tambah (prioritas):**
- **P0 — Decision table checkout:** 8 kombinasi field checkout (3 field × kosong/isi) sebagai satu test data-driven; pastikan urutan validasi terdefinisi (first → last → postal).
- **P1 — BVA postal code:** kosong, 1 karakter, 4 karakter, 5 karakter (format standar), karakter non-digit.

**Kurangi:**
- **P1 — Overlap kecil di `checkout-flow.spec.ts`:** test "Login dengan user valid" dan "user di-lock" duplikat fungsional dari `login.spec.ts`. Cukup pertahankan di `login.spec.ts`; di `checkout-flow` fokus pada skenario end-to-end.

**Improve:**
- **P1 — Verifikasi nilai bisnis:** beberapa test hanya cek badge/keberadaan elemen, belum cek nilai total/order yang benar secara end-to-end setelah finish.
- **P1 — Sort:** pastikan asersi urutan membandingkan array penuh, bukan hanya elemen pertama.

### 2.3 Back Office (74 test)

**Cakupan teknik:**

| Teknik | Skor | Bukti |
|---|---|---|
| EP | ✓ | login valid/invalid/empty, status code 200/301/404/500, dropdown option 1/2, checkbox on/off |
| BVA | ✗ | tidak ada (inputs tidak diuji batas min/max; slider hanya rentang 0–5) |
| Decision Table | ✗ | tidak ada |
| State Transition | ◐ | dynamic-controls (checkbox ada→hapus→tambah), dynamic-loading (finish hidden→start→loading→finish), entry-ad (buka→tutup→buka) — ada tapi tidak formal |
| Use Case | ◐ | tiap widget diuji terpisah; tidak ada flow antar-modul (mis. login→dashboard→modul) |
| Error Guessing | ✓ | broken images, context menu alert, status code 500, redirect |

**Tambah (prioritas):**
- **P1 — BVA inputs:** nilai min/max integer, angka dengan banyak desimal, nilai sangat besar/negatif.
- **P1 — BVA slider:** nilai batas 0 dan 5 dipastikan tercapai, plus nilai di tengah-tengah.
- **P2 — State transition formal** untuk dynamic-controls (model 2-state dengan valid transition table).

**Kurangi:**
- Tidak ada redundansi signifikan.

**Improve:**
- **P1 — Use case lintas-modul:** tambah skenario navigasi berurutan (dashboard → modul → kembali) sebagai satu use case.
- **P1 — Asersi:** beberapa test verifikasi tampil/tidak tampil saja; bisa diperkuat dengan nilai/teks spesifik.

### 2.4 Unit Test (5 test)

- **Cakupan teknik:** White-box branch coverage untuk `shared/pdf/aggregate.ts` terpenuhi (happy path, filter, kosong, gagal).
- **Tambah:** tidak wajib; jaga coverage tetap relevan saat agregasi berubah.
- **Improve:** pertimbangkan menambahkan decision coverage pada cabang `flaky` dan `skipped` di agregasi.

## 3. Evaluasi 7 Prinsip Testing

| # | Prinsip | Skor | Catatan |
|---|---|---|---|
| 1 | Testing menunjukkan adanya defect | ✓ | Negatif case dominan di semua layer |
| 2 | Exhaustive testing mustahil | ◐ | Tagging `@smoke/@critical` ada, tapi pemilihan skenario belum berbasis risiko formal |
| 3 | Early testing hemat biaya | n/a | Proyek demo; dicatat sebagai observasi, bukan evaluasi |
| 4 | Defect clustering | ◐ | Error guessing terfokus di beberapa area, tapi tidak ada data defect untuk validasi klaster |
| 5 | Pesticide paradox | ◐ | Suite statis; perlu review berkala & test baru (lihat rencana aksi) |
| 6 | Testing context dependent | ✓ | Teknik berbeda per konteks (API black-box, UI widget) |
| 7 | Absence-of-errors fallacy | ◐ | Banyak test verifikasi "sukses" tanpa cek kelengkapan requirement/bisnis |

## 4. Rencana Aksi Prioritas

| Prioritas | Aksi | Layer | Effort |
|---|---|---|---|
| P0 | Kurangi redundansi `users.spec.ts` (pindah/hapus blok Inventory & Cart) | API | Rendah |
| P0 | Decision table checkout (8 kombinasi field) | App | Sedang |
| P1 | BVA pagination API (`limit`/`skip` boundary) | API | Rendah |
| P1 | BVA postal code & inputs & slider | App + Back Office | Rendah |
| P1 | Kurangi overlap login di `checkout-flow.spec.ts` | App | Rendah |
| P1 | Perkuat asersi schema (API) & nilai bisnis (App) | API + App | Sedang |
| P1 | Konsistensi tagging `@smoke`/`@critical` | Semua | Rendah |
| P2 | State transition formal (cart, dynamic-controls) | App + Back Office | Sedang |
| P2 | Exploratory testing charter & checklist-based testing | Semua | Sedang |
| P2 | White-box coverage tooling | API | Tinggi |

Prioritas default: **P0 → P1 → P2**, kecuali ada risiko bisnis yang meminta pembalikan.

## 5. Lampiran — Glosarium Teknik CTFL v4

| Teknik | Definisi singkat |
|---|---|
| Equivalence Partitioning (EP) | Membagi domain input ke kelas yang diharapkan berperilaku sama; uji 1 perwakilan per kelas |
| Boundary Value Analysis (BVA) | Menguji nilai tepat di batas partisi (min-1, min, max, max+1) |
| Decision Table | Menguji kombinasi kondisi → aksi secara sistematis (2^n kombinasi) |
| State Transition | Memodelkan sistem sebagai state + transisi; menguji transisi valid/invalid |
| Use Case | Menguji alur interaksi end-to-end dari aktor |
| Error Guessing | Menebak defect berdasarkan pengalaman/pola umum |
| Exploratory Testing | Eksplorasi simultan design + eksekusi + pembelajaran |
| Checklist-based Testing | Uji terstruktur berbasis daftar periksa |
| White-box (statement/branch) | Mengukur sejauh mana kode dieksekusi/di-branch |
