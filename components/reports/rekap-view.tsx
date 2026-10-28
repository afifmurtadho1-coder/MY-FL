"use client"

import {
  AlertTriangle,
  CalendarDays,
  ChartNoAxesColumn,
  ChartPie,
  Flame,
  Layers,
  Loader2,
  PiggyBank,
  ReceiptText,
  RotateCcw,
  Target,
  Wallet,
  WalletCards,
} from "lucide-react"
import { useEffect, useState } from "react"

import { AppIcon } from "@/components/expenses/app-icon"
import { ComparisonBadge } from "@/components/reports/comparison-badge"
import { MonthlyCategoryDonut } from "@/components/reports/monthly-category-donut"
import { MonthlyTrendChart } from "@/components/reports/monthly-trend-chart"
import { PeriodPicker } from "@/components/reports/period-picker"
import { PlatformCards } from "@/components/reports/platform-cards"
import { ReportTransactionRow } from "@/components/reports/report-transaction-row"
import { WeeklyBarChart } from "@/components/reports/weekly-bar-chart"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  useDailyReport,
  useMonthlyReport,
  useWeeklyReport,
} from "@/hooks/use-reports"
import { getReadErrorMessage } from "@/lib/errors"
import {
  formatDayLabel,
  formatMonthLabel,
  formatWeekLabel,
  getTodayKey,
  startOfMonthKey,
  startOfWeekKey,
} from "@/lib/reports-date"
import { cn, formatRupiah } from "@/lib/utils"
import type {
  DailyPoint,
  DailyReport,
  MonthlyReport,
  PlatformSummary,
  WeeklyReport,
} from "@/types/reports"

type Tab = "harian" | "mingguan" | "bulanan" | "tabungan"

const tabs = [
  { id: "harian" as const, label: "Harian", icon: CalendarDays },
  { id: "mingguan" as const, label: "Mingguan", icon: ChartNoAxesColumn },
  { id: "bulanan" as const, label: "Bulanan", icon: ChartPie },
  { id: "tabungan" as const, label: "Tabungan", icon: PiggyBank },
]

function ReportSkeleton() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-32 rounded-2xl" />
      <Skeleton className="h-64 rounded-2xl" />
      <Skeleton className="h-44 rounded-2xl" />
    </div>
  )
}

function TabunganContent() {
  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 p-5 text-white shadow-lg shadow-emerald-500/20">
        <div
          aria-hidden
          className="absolute -right-8 -top-10 size-32 rounded-full bg-white/10 blur-2xl"
        />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="text-xs text-emerald-50">Rekap Tabungan</p>
            <p className="mt-1 text-xl font-semibold tracking-tight">
              Pantau progres semua target tabungan
            </p>
            <p className="mt-1 text-xs text-emerald-100">
              Lihat total terkumpul, target, dan sisa per kategori
            </p>
          </div>
          <span className="flex size-11 items-center justify-center rounded-2xl bg-white/15">
            <PiggyBank className="size-5" />
          </span>
        </div>
      </section>

      <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Target className="size-4" />
          </span>
          <div>
            <h2 className="text-base font-semibold tracking-tight">
              Kategori Tabungan yang Didukung
            </h2>
            <p className="text-xs text-muted-foreground">
              Rekomendasi kategori buat target keuangan kamu
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            {
              label: "Investasi",
              desc: "Reksa dana, saham, emas, atau instrumen investasi lain",
              color: "#22c55e",
            },
            {
              label: "Tabungan Anak",
              desc: "Dana pendidikan atau kebutuhan anak",
              color: "#f59e0b",
            },
            {
              label: "Tabungan Istri Melahirkan",
              desc: "Persiapan biaya persalinan & kebutuhan ibu-bayi",
              color: "#ec4899",
            },
            {
              label: "Tabungan Beli Rumah",
              desc: "DP rumah, renovasi, atau biaya KPR",
              color: "#6366f1",
            },
            {
              label: "Tabungan Lainnya",
              desc: "Target tabungan lain sesuai kebutuhan kamu",
              color: "#06b6d4",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between rounded-xl border border-border/60 p-3"
            >
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <span
                className="size-2.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col items-center rounded-2xl border border-dashed border-border/80 bg-muted/20 px-4 py-10 text-center">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <PiggyBank className="size-6" />
        </span>
        <p className="mt-3 text-sm font-medium">Rekap tabungan siap dipakai</p>
        <p className="mt-1 max-w-sm text-xs text-muted-foreground">
          Buka menu Tabungan buat buat target baru, setor, atau tarik. Hasilnya bakal muncul di sini buat kamu pantau secara berkala.
        </p>
      </section>
    </div>
  )
}

function PlatformSection({ data }: { data: PlatformSummary }) {
  return (
    <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
          <WalletCards className="size-4" />
        </span>
        <div>
          <h2 className="text-base font-semibold tracking-tight">
            Rekap per platform
          </h2>
          <p className="text-xs text-muted-foreground">
            {formatRupiah(data.total)} · {data.jumlah_transaksi} transaksi
          </p>
        </div>
      </div>

      <div className="mt-4">
        <PlatformCards platforms={data.platform} />
      </div>
    </section>
  )
}

function DailyContent({ data }: { data: DailyReport }) {
  const { summary, comparison, platforms } = data

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Total pengeluaran</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight">
              {formatRupiah(summary.total)}
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              {formatDayLabel(summary.tanggal)}
            </p>
          </div>
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <CalendarDays className="size-5" />
          </span>
        </div>

        <div className="mt-4">
          <ComparisonBadge comparison={comparison} label="dibanding kemarin" />
        </div>
      </section>

      <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold tracking-tight">
              Daftar transaksi
            </h2>
            <p className="text-xs text-muted-foreground">
              Semua pengeluaran pada tanggal ini.
            </p>
          </div>
          <Badge variant="secondary">{summary.jumlah_transaksi}</Badge>
        </div>

        {summary.transaksi.length === 0 ? (
          <div className="mt-5 flex flex-col items-center rounded-xl border border-dashed border-border/80 bg-muted/20 px-4 py-9 text-center">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <ReceiptText className="size-6" />
            </span>
            <p className="mt-3 text-sm font-medium">Belum ada transaksi</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Tidak ada pengeluaran yang tercatat pada tanggal ini.
            </p>
          </div>
        ) : (
          <div className="mt-4 divide-y divide-border/50 overflow-hidden rounded-xl border border-border/60">
            {summary.transaksi.map((expense) => (
              <ReportTransactionRow key={expense.id} expense={expense} />
            ))}
          </div>
        )}
      </section>

      <PlatformSection data={platforms} />
    </div>
  )
}

function WeeklyContent({ data }: { data: WeeklyReport }) {
  const { summary, comparison, categories, platforms } = data
  const topCategory = categories.per_kategori[0] ?? null

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground">
              Total Senin–Minggu
            </p>
            <p className="mt-1 text-2xl font-semibold tracking-tight">
              {formatRupiah(summary.total)}
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              {formatWeekLabel(summary.mulai)}
            </p>
          </div>
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
            <ChartNoAxesColumn className="size-5" />
          </span>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <div className="rounded-xl bg-muted/40 px-3 py-2.5">
            <p className="text-[11px] text-muted-foreground">Transaksi</p>
            <p className="mt-0.5 text-sm font-semibold">
              {summary.jumlah_transaksi}
            </p>
          </div>
          <div className="rounded-xl bg-muted/40 px-3 py-2.5">
            <p className="text-[11px] text-muted-foreground">
              Rata-rata per hari
            </p>
            <p className="mt-0.5 text-sm font-semibold">
              {formatRupiah(summary.rata_rata_harian)}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <ComparisonBadge
            comparison={comparison}
            label="dibanding minggu lalu"
          />
        </div>
      </section>

      <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold tracking-tight">
              Pengeluaran harian
            </h2>
            <p className="text-xs text-muted-foreground">
              Grafik batang Senin sampai Minggu.
            </p>
          </div>
          <Layers className="size-4 text-muted-foreground" />
        </div>
        <div className="mt-4">
          <WeeklyBarChart data={summary.harian} />
        </div>
      </section>

      <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Flame className="size-4" />
          </span>
          <div>
            <h2 className="text-base font-semibold tracking-tight">
              Kategori terbesar
            </h2>
            <p className="text-xs text-muted-foreground">
              Penyumbang pengeluaran terbesar minggu ini.
            </p>
          </div>
        </div>

        {topCategory ? (
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-border/60 bg-muted/20 p-3.5">
            <span
              className="flex size-10 shrink-0 items-center justify-center rounded-xl"
              style={{
                backgroundColor: `${topCategory.color}1f`,
                color: topCategory.color,
              }}
            >
              <AppIcon name={topCategory.icon} className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{topCategory.name}</p>
              <p className="text-[11px] text-muted-foreground">
                {topCategory.jumlah_transaksi} transaksi ·{" "}
                {topCategory.persentase ?? 0}% dari total
              </p>
            </div>
            <p className="shrink-0 text-sm font-semibold tracking-tight">
              {formatRupiah(topCategory.total)}
            </p>
          </div>
        ) : (
          <p className="mt-4 rounded-xl border border-dashed border-border/80 bg-muted/20 px-4 py-6 text-center text-xs text-muted-foreground">
            Belum ada kategori pada minggu ini.
          </p>
        )}
      </section>

      <PlatformSection data={platforms} />
    </div>
  )
}

function MonthlyContent({ data }: { data: MonthlyReport }) {
  const { summary, comparison, platforms } = data
  const worstDay = summary.harian.reduce<DailyPoint | null>((worst, item) => {
    if (item.total <= 0) {
      return worst
    }

    if (!worst || item.total > worst.total) {
      return item
    }

    return worst
  }, null)

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Total pengeluaran</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight">
              {formatRupiah(summary.total)}
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              {formatMonthLabel(summary.bulan)}
            </p>
          </div>
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <ChartPie className="size-5" />
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-muted/40 px-3 py-2.5">
            <p className="text-[11px] text-muted-foreground">
              Rata-rata per hari
            </p>
            <p className="mt-0.5 text-sm font-semibold">
              {formatRupiah(summary.rata_rata_harian)}
            </p>
          </div>
          <div className="rounded-xl bg-muted/40 px-3 py-2.5">
            <p className="text-[11px] text-muted-foreground">
              Hari paling boros
            </p>
            <p className="mt-0.5 text-sm font-semibold">
              {worstDay ? formatRupiah(worstDay.total) : "—"}
            </p>
            {worstDay && (
              <p className="text-[10px] text-muted-foreground">
                {formatDayLabel(worstDay.tanggal)}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4">
          <ComparisonBadge
            comparison={comparison}
            label="dibanding bulan lalu"
          />
        </div>
      </section>

      <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400">
            <ChartPie className="size-4" />
          </span>
          <div>
            <h2 className="text-base font-semibold tracking-tight">
              Pengeluaran per kategori
            </h2>
            <p className="text-xs text-muted-foreground">
              Proporsi kategori bulan ini.
            </p>
          </div>
        </div>
        <div className="mt-4">
          <MonthlyCategoryDonut categories={summary.per_kategori} />
        </div>
      </section>

      <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
            <ChartNoAxesColumn className="size-4" />
          </span>
          <div>
            <h2 className="text-base font-semibold tracking-tight">
              Tren harian
            </h2>
            <p className="text-xs text-muted-foreground">
              Perubahan pengeluaran sepanjang bulan.
            </p>
          </div>
        </div>
        <div className="mt-4">
          <MonthlyTrendChart data={summary.harian} />
        </div>
      </section>

      <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold tracking-tight">
              Top 5 transaksi terbesar
            </h2>
            <p className="text-xs text-muted-foreground">
              Pengeluaran paling besar bulan ini.
            </p>
          </div>
          <Badge variant="secondary">{summary.top_transaksi.length}</Badge>
        </div>

        {summary.top_transaksi.length === 0 ? (
          <div className="mt-5 flex flex-col items-center rounded-xl border border-dashed border-border/80 bg-muted/20 px-4 py-9 text-center">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <Wallet className="size-6" />
            </span>
            <p className="mt-3 text-sm font-medium">Belum ada transaksi</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Top transaksi akan muncul setelah ada pengeluaran bulan ini.
            </p>
          </div>
        ) : (
          <div className="mt-4 divide-y divide-border/50 overflow-hidden rounded-xl border border-border/60">
            {summary.top_transaksi.map((expense, index) => (
              <ReportTransactionRow
                key={expense.id}
                expense={expense}
                rank={index + 1}
                showDate
              />
            ))}
          </div>
        )}
      </section>

      <PlatformSection data={platforms} />
    </div>
  )
}

export function RekapView() {
  const [today, setToday] = useState<string | null>(null)
  const [tab, setTab] = useState<Tab>("harian")
  const [dayAnchor, setDayAnchor] = useState<string | null>(null)
  const [weekAnchor, setWeekAnchor] = useState<string | null>(null)
  const [monthAnchor, setMonthAnchor] = useState<string | null>(null)

  useEffect(() => {
    const t = getTodayKey()
    setToday(t)
    setDayAnchor(t)
    setWeekAnchor(startOfWeekKey(t))
    setMonthAnchor(startOfMonthKey(t))
  }, [])

  const dailyQuery = useDailyReport(dayAnchor ?? "", tab === "harian" && dayAnchor !== null)
  const weeklyQuery = useWeeklyReport(weekAnchor ?? "", tab === "mingguan" && weekAnchor !== null)
  const monthlyQuery = useMonthlyReport(monthAnchor ?? "", tab === "bulanan" && monthAnchor !== null)

  const activeQuery =
    tab === "harian"
      ? dailyQuery
      : tab === "mingguan"
        ? weeklyQuery
        : monthlyQuery

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Analisis pengeluaran</p>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Rekap
        </h1>
      </div>

      <div
        role="tablist"
        aria-label="Jenis rekap"
        className="grid grid-cols-3 gap-1 rounded-2xl border border-border/60 bg-muted/30 p-1"
      >
        {tabs.map((item) => {
          const Icon = item.icon
          const active = tab === item.id

          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(item.id)}
              className={cn(
                "flex items-center justify-center gap-1.5 rounded-xl px-2 py-2 text-xs font-medium transition sm:text-sm",
                active
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="size-3.5" />
              {item.label}
            </button>
          )
        })}
      </div>

      {tab === "harian" && dayAnchor && today && (
        <PeriodPicker
          mode="day"
          value={dayAnchor}
          onChange={setDayAnchor}
          today={today}
        />
      )}
      {tab === "mingguan" && weekAnchor && today && (
        <PeriodPicker
          mode="week"
          value={weekAnchor}
          onChange={setWeekAnchor}
          today={today}
        />
      )}
      {tab === "bulanan" && monthAnchor && today && (
        <PeriodPicker
          mode="month"
          value={monthAnchor}
          onChange={setMonthAnchor}
          today={today}
        />
      )}

      {activeQuery.isLoading && <ReportSkeleton />}

      {activeQuery.isError && (
        <section className="flex flex-col items-center rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-10 text-center">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <AlertTriangle className="size-7" />
          </span>
          <p className="mt-4 text-sm font-medium">Gagal memuat rekap</p>
          <p className="mt-1 max-w-xs text-xs leading-relaxed text-muted-foreground">
            {getReadErrorMessage(activeQuery.error)}
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => activeQuery.refetch()}
            disabled={activeQuery.isFetching}
            className="mt-5 rounded-xl"
          >
            {activeQuery.isFetching ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <RotateCcw className="size-4" />
            )}
            Coba lagi
          </Button>
        </section>
      )}

      {!activeQuery.isLoading &&
        !activeQuery.isError &&
        tab === "harian" &&
        dailyQuery.data && <DailyContent data={dailyQuery.data} />}

      {!activeQuery.isLoading &&
        !activeQuery.isError &&
        tab === "mingguan" &&
        weeklyQuery.data && <WeeklyContent data={weeklyQuery.data} />}

      {!activeQuery.isLoading &&
        !activeQuery.isError &&
        tab === "bulanan" &&
        monthlyQuery.data && <MonthlyContent data={monthlyQuery.data} />}

      {!activeQuery.isLoading && !activeQuery.isError && tab === "tabungan" && (
        <TabunganContent />
      )}
    </div>
  )
}
