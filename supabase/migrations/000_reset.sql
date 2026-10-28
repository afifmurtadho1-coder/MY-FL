begin;

drop function if exists public.rekap_harian(date);
drop function if exists public.rekap_mingguan(date);
drop function if exists public.rekap_bulanan(date);
drop function if exists public.rekap_kategori(date, date);
drop function if exists public.rekap_per_platform(date, date);
drop function if exists public.perbandingan_periode(date, date);
drop function if exists public.ringkasan_budget(date);
drop function if exists public.transaksi_terbaru(integer);

drop table if exists public.budgets cascade;
drop table if exists public.expenses cascade;
drop table if exists public.payment_methods cascade;
drop table if exists public.categories cascade;

drop function if exists public.set_updated_at();

commit;
