# CTFL v4.0 Gap Analysis — Design Spec

- **Tanggal**: 2026-08-02
- **Status**: Disetujui user
- **Project**: `qa-automation-demo` (Playwright + TypeScript)

## 1. Konteks

Project `qa-automation-demo` memiliki 213 test case (API 80, App 54, Back Office 74, Unit 5). User ingin mengevaluasi kualitas & kelengkapan suite tersebut terhadap standar **ISTQB CTFL v4.0 (2023)** untuk mengetahui apa yang perlu **ditambah, dikurangi, atau diimprove**.

Deliverable yang disepakati: **dokumen gap analysis saja** (tanpa perubahan kode). Pendekatan yang dipilih: **B — dokumen ringkas per layer + rekomendasi prioritas** (bukan matriks 213 baris per test case).

## 2. Tujuan

1. Memetakan cakupan suite terhadap teknik test design CTFL v4 (EP, BVA, decision table, state transition, use case, experience-based, white-box).
2. Mengevaluasi kepatuhan terhadap 7 prinsip testing dan test types (functional, non-functional, change-related).
3. Memberi daftar aksi konkret: Tambah / Kurang / Improve, berprioritas P0/P1/P2.

## 3. Bukan Tujuan (Non-Goals)

- Mengubah/menambah kode test (implementasi test baru).
- Menulis matriks pemetaan per test case (Pendekatan A).
- Menulis template test case eksekusi penuh (Pendekatan C).
- Sertifikasi formal / persiapan ujian CTFL.

## 4. Assessment Kondisi Saat Ini

Temuan awal yang menjadi dasar dokumen:

- **EP** terpenuhi luas (valid/invalid/empty di semua layer).
- **BVA** belum ada (tidak ada test batas min/max).
- **Decision Table** sebagian — checkout field kosong diuji terpisah, bukan kombinasi (8 kombinasi).
- **State Transition** sebagian — cart/dynamic controls ada alurnya tapi tidak formal.
- **Use Case** terpenuhi — `checkout-flow` end-to-end.
- **Error Guessing** terpenuhi — `problem_user`, `performance_glitch_user`, broken images.
- **White-box** sebagian — unit test PDF-aggregate, tanpa coverage tooling.
- **Redundansi** — `users.spec.ts` memuat test Cart & Inventory yang sudah ada di file lain.

## 5. Design

### 5.1 Struktur Dokumen

File: `docs/ctfl-gap-analysis.md`

1. **Ringkasan Eksekutif** — tujuan, standar acuan, metodologi, verdict matriks skor per layer.
2. **Assessment per Layer** (4 sub-bab: API / App / Back Office / Unit):
   - Tabel cakupan teknik CTFL (✓ terpenuhi / ◐ sebagian / ✗ tidak ada + bukti test).
   - Tabel cakupan test types (functional, non-functional, change-related).
   - Temuan gap: Tambah / Kurang / Improve berprioritas.
3. **7 Prinsip Testing** — evaluasi kepatuhan suite per prinsip dengan bukti.
4. **Rencana Aksi Prioritas** (P0/P1/P2) — gabungan semua layer.
5. **Lampiran** — glosarium singkat teknik CTFL v4.

### 5.2 Skema Penilaian

| Skor | Arti |
|---|---|
| ✓ Terpenuhi | Ada ≥ 1 test yang menerapkan teknik dengan benar |
| ◐ Sebagian | Ada test, tapi belum utuh/formal |
| ✗ Tidak ada | Tidak ada test yang menerapkan |

### 5.3 Rencana Aksi Awal

- **P0:** Kurangi redundansi API (`users.spec.ts`); decision table checkout.
- **P1:** BVA inputs & postal code; perbaiki asersi lemah; konsistensi tagging.
- **P2:** State transition formal; exploratory testing charter; coverage tooling white-box.

## 6. Verifikasi & Dokumen

- Dokumen dibaca ulang: tidak ada placeholder, konsisten antar bagian, skor sesuai bukti test aktual.
- Tidak ada perubahan kode; hanya `docs/ctfl-gap-analysis.md` (dipush dengan `-f` karena `docs/` ter-ignore di git).
