begin;

create or replace function public.rekap_kategori(
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
      e.amount,
      c.id as category_id,
      c.name,
      c.icon,
      c.color
    from public.expenses e
    left join public.categories c on c.id = e.category_id
    where e.user_id = auth.uid()
      and e.expense_date between p_mulai and p_selesai
  ),
  summary as (
    select coalesce(sum(amount), 0) as total, count(*) as jumlah_transaksi
    from data
  ),
  grouped as (
    select
      category_id,
      coalesce(name, 'Tanpa Kategori') as name,
      coalesce(icon, 'circle-help') as icon,
      coalesce(color, '#6B7280') as color,
      sum(amount) as total,
      count(*) as jumlah_transaksi
    from data
    group by category_id, name, icon, color
  )
  select jsonb_build_object(
    'mulai', p_mulai,
    'selesai', p_selesai,
    'total', (select total from summary),
    'jumlah_transaksi', (select jumlah_transaksi from summary),
    'per_kategori', coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'category_id', g.category_id,
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

create or replace function public.ringkasan_budget(
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
  v_budget numeric;
  v_spent numeric;
begin
  v_start := date_trunc('month', p_bulan)::date;
  v_end := (v_start + interval '1 month - 1 day')::date;

  select coalesce(sum(amount), 0)
    into v_budget
  from public.budgets
  where user_id = auth.uid()
    and month = v_start;

  select coalesce(sum(amount), 0)
    into v_spent
  from public.expenses
  where user_id = auth.uid()
    and expense_date between v_start and v_end;

  return jsonb_build_object(
    'bulan', v_start,
    'total_budget', v_budget,
    'total_pengeluaran', v_spent,
    'sisa', v_budget - v_spent,
    'persentase_terpakai',
      case
        when v_budget = 0 then null
        else round((v_spent / v_budget) * 100, 2)
      end
  );
end;
$$;

create or replace function public.transaksi_terbaru(
  p_limit integer default 5
)
returns jsonb
language sql
stable
security invoker
set search_path = ''
as $$
  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'id', t.id,
        'amount', t.amount,
        'note', t.note,
        'expense_date', t.expense_date,
        'created_at', t.created_at,
        'category_id', t.category_id,
        'category_name', t.category_name,
        'category_icon', t.category_icon,
        'category_color', t.category_color,
        'payment_method_id', t.payment_method_id,
        'payment_method_name', t.payment_method_name,
        'payment_method_icon', t.payment_method_icon,
        'payment_method_color', t.payment_method_color
      )
      order by t.expense_date desc, t.created_at desc
    ),
    '[]'::jsonb
  )
  from (
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
    order by e.expense_date desc, e.created_at desc
    limit least(greatest(p_limit, 1), 50)
  ) t;
$$;

revoke all on function public.rekap_kategori(date, date) from public;
revoke all on function public.ringkasan_budget(date) from public;
revoke all on function public.transaksi_terbaru(integer) from public;

grant execute on function public.rekap_kategori(date, date) to authenticated;
grant execute on function public.ringkasan_budget(date) to authenticated;
grant execute on function public.transaksi_terbaru(integer) to authenticated;

commit;
