begin;

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  icon text,
  color text,
  description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.payment_methods (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  color text,
  icon text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  amount numeric(14, 0) not null check (amount > 0),
  expense_date date not null default ((now() at time zone 'Asia/Jakarta')::date),
  category_id uuid references public.categories(id) on delete set null,
  payment_method_id uuid references public.payment_methods(id) on delete set null,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete cascade,
  month date not null,
  amount numeric(14, 0) not null default 0 check (amount >= 0),
  constraint budgets_user_category_month_key unique (user_id, category_id, month)
);

create index expenses_user_id_idx on public.expenses (user_id);
create index expenses_expense_date_idx on public.expenses (expense_date);
create index expenses_category_id_idx on public.expenses (category_id);
create index expenses_payment_method_id_idx on public.expenses (payment_method_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger expenses_set_updated_at
before update on public.expenses
for each row
execute function public.set_updated_at();

alter table public.categories enable row level security;
alter table public.payment_methods enable row level security;
alter table public.expenses enable row level security;
alter table public.budgets enable row level security;

create policy "categories_select_authenticated"
on public.categories
for select
to authenticated
using (true);

create policy "payment_methods_select_authenticated"
on public.payment_methods
for select
to authenticated
using (true);

create policy "expenses_select_own"
on public.expenses
for select
to authenticated
using (user_id = auth.uid());

create policy "expenses_insert_own"
on public.expenses
for insert
to authenticated
with check (user_id = auth.uid());

create policy "expenses_update_own"
on public.expenses
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "expenses_delete_own"
on public.expenses
for delete
to authenticated
using (user_id = auth.uid());

create policy "budgets_select_own"
on public.budgets
for select
to authenticated
using (user_id = auth.uid());

create policy "budgets_insert_own"
on public.budgets
for insert
to authenticated
with check (user_id = auth.uid());

create policy "budgets_update_own"
on public.budgets
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "budgets_delete_own"
on public.budgets
for delete
to authenticated
using (user_id = auth.uid());

grant usage on schema public to authenticated;
grant select on public.categories, public.payment_methods to authenticated;
grant select, insert, update, delete on public.expenses, public.budgets to authenticated;

insert into public.payment_methods (id, name, color, icon, sort_order) values
  ('00000000-0000-4000-8000-000000000101', 'Wondr', '#FF6B00', 'wallet', 1),
  ('00000000-0000-4000-8000-000000000102', 'Beyond', '#0F4C81', 'landmark', 2),
  ('00000000-0000-4000-8000-000000000103', 'Livin', '#FFB700', 'smartphone', 3),
  ('00000000-0000-4000-8000-000000000104', 'BCA Mobile', '#0060AF', 'building-2', 4),
  ('00000000-0000-4000-8000-000000000105', 'DANA', '#118EEA', 'wallet-cards', 5),
  ('00000000-0000-4000-8000-000000000106', 'OVO', '#4C3494', 'circle-dollar-sign', 6),
  ('00000000-0000-4000-8000-000000000107', 'GoPay', '#00AED6', 'smartphone', 7),
  ('00000000-0000-4000-8000-000000000108', 'ShopeePay', '#EE4D2D', 'shopping-bag', 8),
  ('00000000-0000-4000-8000-000000000109', 'SeaBank', '#F05A28', 'waves', 9),
  ('00000000-0000-4000-8000-000000000110', 'Cash', '#16A34A', 'banknote', 10)
on conflict (id) do nothing;

insert into public.categories (id, name, icon, color, description, sort_order) values
  ('00000000-0000-4000-8000-000000000001', 'Makan & Minum', 'utensils', '#F97316', 'Makan di luar, warteg, restoran, kopi, jajan, dan minuman harian.', 1),
  ('00000000-0000-4000-8000-000000000002', 'Belanja Dapur & Groceries', 'shopping-basket', '#22C55E', 'Bahan masakan, sembako, buah, sayur, dan kebutuhan dapur.', 2),
  ('00000000-0000-4000-8000-000000000003', 'Transportasi', 'bus', '#3B82F6', 'Ojek online, KRL, MRT, TransJakarta, bensin, parkir, tol, servis kendaraan.', 3),
  ('00000000-0000-4000-8000-000000000004', 'Tagihan & Utilitas', 'receipt', '#8B5CF6', 'Listrik, air, internet, pulsa, paket data, langganan bulanan rutin.', 4),
  ('00000000-0000-4000-8000-000000000005', 'Belanja Online & Fashion', 'shopping-bag', '#EC4899', 'Marketplace, pakaian, sepatu, aksesoris, dan barang keinginan.', 5),
  ('00000000-0000-4000-8000-000000000006', 'Hiburan & Hobi', 'gamepad-2', '#EAB308', 'Nonton, game, top up game, Netflix/Spotify, nongkrong, hobi.', 6),
  ('00000000-0000-4000-8000-000000000007', 'Kesehatan', 'heart-pulse', '#EF4444', 'Obat, vitamin, dokter, rumah sakit, BPJS, perawatan diri.', 7),
  ('00000000-0000-4000-8000-000000000008', 'Pendidikan & Pengembangan Diri', 'graduation-cap', '#6366F1', 'Kursus, buku, pelatihan, langganan belajar, biaya sekolah/kuliah.', 8),
  ('00000000-0000-4000-8000-000000000009', 'Rumah & Tempat Tinggal', 'home', '#92400E', 'Sewa/kos, perabot, perlengkapan rumah, perbaikan.', 9),
  ('00000000-0000-4000-8000-000000000010', 'Sosial & Keluarga', 'gift', '#14B8A6', 'Hadiah, sumbangan, kondangan, kirim uang keluarga, zakat, sedekah.', 10),
  ('00000000-0000-4000-8000-000000000011', 'Tabungan & Investasi', 'piggy-bank', '#10B981', 'Dana darurat, reksadana, saham, emas, transfer ke tabungan.', 11),
  ('00000000-0000-4000-8000-000000000012', 'Biaya Admin & Lainnya', 'more-horizontal', '#6B7280', 'Biaya admin bank, top up fee, denda, pengeluaran tak terduga.', 12)
on conflict (id) do nothing;

create or replace function public.rekap_harian(
  p_tanggal date default ((now() at time zone 'Asia/Jakarta')::date)
)
returns jsonb
language sql
stable
security invoker
set search_path = ''
as $$
  with data as (
    select
      e.id,
      e.amount,
      e.note,
      e.expense_date,
      e.created_at,
      c.id as category_id,
      c.name as category_name,
      c.icon as category_icon,
      c.color as category_color,
      pm.id as payment_method_id,
      pm.name as payment_method_name,
      pm.icon as payment_method_icon,
      pm.color as payment_method_color
    from public.expenses e
    left join public.categories c on c.id = e.category_id
    left join public.payment_methods pm on pm.id = e.payment_method_id
    where e.user_id = auth.uid()
      and e.expense_date = p_tanggal
  )
  select jsonb_build_object(
    'tanggal', p_tanggal,
    'total', coalesce((select sum(amount) from data), 0),
    'jumlah_transaksi', (select count(*) from data),
    'transaksi', coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'id', d.id,
            'amount', d.amount,
            'note', d.note,
            'expense_date', d.expense_date,
            'category_id', d.category_id,
            'category_name', d.category_name,
            'category_icon', d.category_icon,
            'category_color', d.category_color,
            'payment_method_id', d.payment_method_id,
            'payment_method_name', d.payment_method_name,
            'payment_method_icon', d.payment_method_icon,
            'payment_method_color', d.payment_method_color
          )
          order by d.created_at desc
        )
        from data d
      ),
      '[]'::jsonb
    )
  );
$$;

create or replace function public.rekap_mingguan(
  p_tanggal date default ((now() at time zone 'Asia/Jakarta')::date)
)
returns jsonb
language plpgsql
stable
security invoker
set search_path = ''
as $$
declare
  v_start date;
  v_end date;
  v_total numeric;
  v_count bigint;
  v_harian jsonb;
begin
  v_start := date_trunc('week', p_tanggal)::date;
  v_end := v_start + 6;

  select coalesce(sum(amount), 0), count(*)
    into v_total, v_count
  from public.expenses
  where user_id = auth.uid()
    and expense_date between v_start and v_end;

  select jsonb_agg(
    jsonb_build_object(
      'tanggal', d.day::date,
      'total', coalesce(a.total, 0),
      'jumlah_transaksi', coalesce(a.jumlah, 0)
    )
    order by d.day
  )
    into v_harian
  from generate_series(v_start, v_end, interval '1 day') as d(day)
  left join (
    select expense_date, sum(amount) as total, count(*) as jumlah
    from public.expenses
    where user_id = auth.uid()
      and expense_date between v_start and v_end
    group by expense_date
  ) a on a.expense_date = d.day::date;

  return jsonb_build_object(
    'mulai', v_start,
    'selesai', v_end,
    'total', v_total,
    'jumlah_transaksi', v_count,
    'rata_rata_harian', round(v_total / 7, 0),
    'harian', coalesce(v_harian, '[]'::jsonb)
  );
end;
$$;

create or replace function public.rekap_bulanan(
  p_bulan date default ((now() at time zone 'Asia/Jakarta')::date)
)
returns jsonb
language plpgsql
stable
security invoker
set search_path = ''
as $$
declare
  v_start date;
  v_end date;
  v_days integer;
  v_total numeric;
  v_count bigint;
  v_harian jsonb;
  v_kategori jsonb;
  v_top jsonb;
begin
  v_start := date_trunc('month', p_bulan)::date;
  v_end := (v_start + interval '1 month - 1 day')::date;
  v_days := extract(day from v_end)::integer;

  select coalesce(sum(amount), 0), count(*)
    into v_total, v_count
  from public.expenses
  where user_id = auth.uid()
    and expense_date between v_start and v_end;

  select jsonb_agg(
    jsonb_build_object(
      'tanggal', d.day::date,
      'total', coalesce(a.total, 0),
      'jumlah_transaksi', coalesce(a.jumlah, 0)
    )
    order by d.day
  )
    into v_harian
  from generate_series(v_start, v_end, interval '1 day') as d(day)
  left join (
    select expense_date, sum(amount) as total, count(*) as jumlah
    from public.expenses
    where user_id = auth.uid()
      and expense_date between v_start and v_end
    group by expense_date
  ) a on a.expense_date = d.day::date;

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'category_id', s.category_id,
        'name', s.name,
        'icon', s.icon,
        'color', s.color,
        'total', s.total,
        'jumlah_transaksi', s.jumlah_transaksi,
        'persentase', coalesce(s.persentase, 0)
      )
      order by s.total desc
    ),
    '[]'::jsonb
  )
    into v_kategori
  from (
    select
      c.id as category_id,
      coalesce(c.name, 'Tanpa Kategori') as name,
      coalesce(c.icon, 'circle-help') as icon,
      coalesce(c.color, '#6B7280') as color,
      sum(e.amount) as total,
      count(*) as jumlah_transaksi,
      round((sum(e.amount) / nullif(v_total, 0)) * 100, 2) as persentase
    from public.expenses e
    left join public.categories c on c.id = e.category_id
    where e.user_id = auth.uid()
      and e.expense_date between v_start and v_end
    group by c.id, c.name, c.icon, c.color
  ) s;

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'id', t.id,
        'amount', t.amount,
        'note', t.note,
        'expense_date', t.expense_date,
        'category_name', t.category_name,
        'category_icon', t.category_icon,
        'category_color', t.category_color,
        'payment_method_name', t.payment_method_name,
        'payment_method_icon', t.payment_method_icon,
        'payment_method_color', t.payment_method_color
      )
      order by t.amount desc, t.created_at desc
    ),
    '[]'::jsonb
  )
    into v_top
  from (
    select
      e.id,
      e.amount,
      e.note,
      e.expense_date,
      e.created_at,
      c.name as category_name,
      c.icon as category_icon,
      c.color as category_color,
      pm.name as payment_method_name,
      pm.icon as payment_method_icon,
      pm.color as payment_method_color
    from public.expenses e
    left join public.categories c on c.id = e.category_id
    left join public.payment_methods pm on pm.id = e.payment_method_id
    where e.user_id = auth.uid()
      and e.expense_date between v_start and v_end
    order by e.amount desc, e.created_at desc
    limit 5
  ) t;

  return jsonb_build_object(
    'bulan', v_start,
    'total', v_total,
    'jumlah_transaksi', v_count,
    'rata_rata_harian', round(v_total / greatest(v_days, 1), 0),
    'harian', coalesce(v_harian, '[]'::jsonb),
    'per_kategori', v_kategori,
    'top_transaksi', v_top
  );
end;
$$;

create or replace function public.rekap_per_platform(
  p_mulai date,
  p_selesai date
)
returns jsonb
language sql
stable
security invoker
set search_path = ''
as $$
  with data as (
    select
      pm.id,
      pm.name,
      pm.icon,
      pm.color,
      e.amount
    from public.expenses e
    left join public.payment_methods pm on pm.id = e.payment_method_id
    where e.user_id = auth.uid()
      and e.expense_date between p_mulai and p_selesai
  ),
  summary as (
    select coalesce(sum(amount), 0) as total, count(*) as jumlah_transaksi
    from data
  ),
  grouped as (
    select
      id,
      coalesce(name, 'Tanpa Metode') as name,
      coalesce(icon, 'wallet') as icon,
      coalesce(color, '#6B7280') as color,
      sum(amount) as total,
      count(*) as jumlah_transaksi
    from data
    group by id, name, icon, color
  )
  select jsonb_build_object(
    'mulai', p_mulai,
    'selesai', p_selesai,
    'total', (select total from summary),
    'jumlah_transaksi', (select jumlah_transaksi from summary),
    'platform', coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'payment_method_id', g.id,
            'name', g.name,
            'icon', g.icon,
            'color', g.color,
            'total', g.total,
            'jumlah_transaksi', g.jumlah_transaksi,
            'persentase', round((g.total / nullif((select total from summary), 0)) * 100, 2)
          )
          order by g.total desc
        )
        from grouped g
      ),
      '[]'::jsonb
    )
  );
$$;

create or replace function public.perbandingan_periode(
  p_mulai date,
  p_selesai date
)
returns jsonb
language plpgsql
stable
security invoker
set search_path = ''
as $$
declare
  v_jumlah_hari integer;
  v_prev_mulai date;
  v_prev_selesai date;
  v_total numeric;
  v_count bigint;
  v_prev_total numeric;
  v_prev_count bigint;
begin
  v_jumlah_hari := (p_selesai - p_mulai) + 1;
  v_prev_selesai := p_mulai - 1;
  v_prev_mulai := v_prev_selesai - (v_jumlah_hari - 1);

  select coalesce(sum(amount), 0), count(*)
    into v_total, v_count
  from public.expenses
  where user_id = auth.uid()
    and expense_date between p_mulai and p_selesai;

  select coalesce(sum(amount), 0), count(*)
    into v_prev_total, v_prev_count
  from public.expenses
  where user_id = auth.uid()
    and expense_date between v_prev_mulai and v_prev_selesai;

  return jsonb_build_object(
    'periode_ini', jsonb_build_object(
      'mulai', p_mulai,
      'selesai', p_selesai,
      'total', v_total,
      'jumlah_transaksi', v_count
    ),
    'periode_sebelumnya', jsonb_build_object(
      'mulai', v_prev_mulai,
      'selesai', v_prev_selesai,
      'total', v_prev_total,
      'jumlah_transaksi', v_prev_count
    ),
    'selisih', v_total - v_prev_total,
    'persentase_perubahan',
      case
        when v_prev_total = 0 then null
        else round(((v_total - v_prev_total) / v_prev_total) * 100, 2)
      end
  );
end;
$$;

revoke all on function public.rekap_harian(date) from public;
revoke all on function public.rekap_mingguan(date) from public;
revoke all on function public.rekap_bulanan(date) from public;
revoke all on function public.rekap_per_platform(date, date) from public;
revoke all on function public.perbandingan_periode(date, date) from public;

grant execute on function public.rekap_harian(date) to authenticated;
grant execute on function public.rekap_mingguan(date) to authenticated;
grant execute on function public.rekap_bulanan(date) to authenticated;
grant execute on function public.rekap_per_platform(date, date) to authenticated;
grant execute on function public.perbandingan_periode(date, date) to authenticated;

commit;
