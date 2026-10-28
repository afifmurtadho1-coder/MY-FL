# MY FL

Aplikasi pencatatan pengeluaran pribadi berbasis Next.js 16, TypeScript, Tailwind CSS, Supabase (Auth + Postgres + RLS), dan TanStack Query.

## Fitur

- Autentikasi (login/register) dengan Supabase Auth
- Tambah/edit/hapus pengeluaran
- Kategori & metode pembayaran
- Beranda dengan ringkasan hari ini/minggu ini/bulan ini, sisa budget, dan transaksi terbaru
- Rekap Harian/Mingguan/Bulanan dengan chart (bar/donut/line)
- Rekap per platform
- Budget bulanan per kategori dengan progress bar berwarna dan peringatan
- Riwayat transaksi dengan filter & export CSV
- Tema terang/gelap
- PWA dasar (manifest + service worker)

## Tech Stack

- Next.js 16, React 19, TypeScript
- Tailwind CSS v4
- shadcn/ui
- Supabase (@supabase/supabase-js, @supabase/ssr)
- TanStack Query
- Recharts
- date-fns, zod, react-hook-form

## Setup Supabase

1. Buat project baru di [supabase.com](https://supabase.com)
2. Buka SQL Editor dan jalankan migrasi berurutan:
   - `supabase/migrations/000_reset.sql` (opsional, untuk reset)
   - `supabase/migrations/001_init.sql` (skema, RLS, fungsi RPC rekap)
   - `supabase/migrations/002_reporting.sql` (fungsi laporan tambahan)
3. Aktifkan Email Auth (Authentication > Providers > Email)
4. Catat `Project URL` dan `anon public key`

## Konfigurasi Environment

Buat file `.env.local` di root project:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Menjalankan Aplikasi

```bash
# Install dependencies
npm install

# Development
npm run dev

# Build production
npm run build

# Start production
npm start

# Lint
npm run lint
```

Buka [http://localhost:3000](http://localhost:3000)

## Struktur Penting

- `app/` - Next.js App Router
- `components/` - UI components
- `hooks/` - React Query hooks
- `lib/data/` - Data layer (Supabase RPC/query)
- `lib/supabase/` - Supabase client/server
- `supabase/migrations/` - SQL migrations
- `types/` - TypeScript types
- `public/manifest.json` - PWA manifest
- `public/sw.js` - Service Worker

## Catatan

- Semua query menggunakan RLS dan fungsi RPC dengan `security invoker`
- Data dikelompokkan per user (`auth.uid()`)
- Export CSV menggunakan data hasil filter di halaman Riwayat
- Budget per kategori disimpan di tabel `budgets` (user_id, category_id, month)
