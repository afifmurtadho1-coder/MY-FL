"use client"

import {
  AlertTriangle,
  ArrowDownLeft,
  CalendarDays,
  ChartPie,
  ChevronRight,
  PiggyBank,
  Plus,
  RotateCcw,
  Sparkles,
  TrendingDown,
  Wallet,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

import Image from "next/image"

import { CountUp } from "@/components/dashboard/count-up"
import { HomeCategoryChart } from "@/components/dashboard/home-chart"
import { AppIcon } from "@/components/expenses/app-icon"
import { useExpenseSheet } from "@/components/expenses/expense-sheet-provider"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useCategoryBudgets } from "@/hooks/use-category-budgets"
import { useDashboard } from "@/hooks/use-reports"
import { getReadErrorMessage } from "@/lib/errors"
import { formatDayLabel, formatMonthLabel, getTodayKey } from "@/lib/reports-date"
import { cn, formatRupiah, formatTanggal } from "@/lib/utils"

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-4 w-28" />
        <Skeleton className="mt-2 h-8 w-40" />
      </div>
      <Skeleton className="h-52 rounded-3xl" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Skeleton className="h-28 rounded-2xl" />
        <Skeleton className="h-28 rounded-2xl" />
        <Skeleton className="col-span-2 h-28 rounded-2xl sm:col-span-1" />
      </div>
      <Skeleton className="h-72 rounded-2xl" />
    </div>
  )
}

export function HomeView() {
  const [today, setToday] = useState<string | null>(null)
  const { openCreate } = useExpenseSheet()
  const dashboardQuery = useDashboard(today)
  const categoryBudgetsQuery = useCategoryBudgets(today)

  useEffect(() => {
    setToday(getTodayKey())
  }, [])

  if (today === null || (dashboardQuery.isLoading && !dashboardQuery.data)) {
    return <DashboardSkeleton />
  }

  if (dashboardQuery.isError || !dashboardQuery.data) {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-sm text-muted-foreground">Selamat datang di</p>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            MY FL
          </h1>
        </div>

        <section className="flex flex-col items-center rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-12 text-center">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <AlertTriangle className="size-7" />
          </span>
          <p className="mt-4 text-sm font-medium">Gagal memuat ringkasan</p>
          <p className="mt-1 max-w-xs text-xs leading-relaxed text-muted-foreground">
            {getReadErrorMessage(dashboardQuery.error)}
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => dashboardQuery.refetch()}
            disabled={dashboardQuery.isFetching}
            className="mt-5 rounded-xl"
          >
            <RotateCcw className="size-4" />
            Coba lagi
          </Button>
        </section>
      </div>
    )
  }

  const { today: todayData, week, month, budget, recent } = dashboardQuery.data
  const hasBudget = budget.total_budget > 0
  const isOverBudget = hasBudget && budget.sisa < 0
  const budgetTone = !hasBudget
    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
    : isOverBudget
      ? "bg-red-500/10 text-red-600 dark:text-red-400"
      : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"

  const categoryBudgets = categoryBudgetsQuery.data ?? []
  const overBudgets = categoryBudgets.filter((b) => b.status === "over")
  const warnBudgets = categoryBudgets.filter((b) => b.status === "warn")

  const chartData = (month.per_kategori ?? [])
    .filter((item) => item.total > 0)
    .slice(0, 5)
    .map((item) => ({
      name: item.name,
      value: Number(item.total),
      color: item.color || "#6366f1",
    }))

  const stats = [
    {
      label: "Hari ini",
      value: todayData.total,
      hint: `${todayData.jumlah_transaksi} transaksi`,
      icon: CalendarDays,
      tone: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
      highlight: false,
    },
    {
      label: "Minggu ini",
      value: week.total,
      hint: `${week.jumlah_transaksi} transaksi`,
      icon: TrendingDown,
      tone: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
      highlight: false,
    },
    {
      label: "Sisa budget",
      value: hasBudget ? budget.sisa : 0,
      hint: hasBudget
        ? `${budget.persentase_terpakai ?? 0}% terpakai`
        : "Budget belum diatur",
      icon: PiggyBank,
      tone: budgetTone,
      highlight: isOverBudget,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Selamat datang di</p>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            MY FL
          </h1>
        </div>
        <span className="hidden rounded-full border border-border/60 bg-card px-3 py-1.5 text-xs text-muted-foreground sm:inline-flex">
          {formatDayLabel(today)}
        </span>
      </div>

      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-violet-700 p-6 text-white shadow-2xl shadow-indigo-500/20 sm:p-8">
        <div
          aria-hidden
          className="absolute -right-10 -top-16 size-48 rounded-full bg-white/10 blur-2xl"
        />
        <div
          aria-hidden
          className="absolute -bottom-20 left-1/3 size-48 rounded-full bg-emerald-400/20 blur-3xl"
        />

        <div className="relative">
          <div className="flex items-center justify-between gap-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
              <Sparkles className="size-3.5" />
              Pengeluaran bulan ini
            </span>
            <Image
              src="/logo.jpeg"
              alt="MY FL"
              width={32}
              height={32}
              className="size-8 rounded-xl object-cover shadow-lg"
            />
          </div>

          <p className="mt-7 text-sm text-indigo-100">
            {formatMonthLabel(today)}
          </p>
          <CountUp
            value={month.total}
            className="mt-1 block text-3xl font-semibold tracking-tight sm:text-4xl"
          />

          <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-indigo-100">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1">
              <ArrowDownLeft className="size-3.5 text-emerald-300" />
              {month.jumlah_transaksi} transaksi
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1">
              Rata-rata {formatRupiah(month.rata_rata_harian)}/hari
            </span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
        {stats
          .filter((stat) => stat.label !== "Sisa budget")
          .map((stat) => {
            const Icon = stat.icon

            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm"
              >
                <span
                  className={`flex size-9 items-center justify-center rounded-xl ${stat.tone}`}
                >
                  <Icon className="size-4" />
                </span>
                <p className="mt-3 text-xs text-muted-foreground">{stat.label}</p>
                <p
                  className={`mt-0.5 text-sm font-semibold tracking-tight sm:text-base ${
                    stat.highlight ? "text-destructive" : ""
                  }`}
                >
                  {formatRupiah(stat.value)}
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {stat.hint}
                </p>
              </div>
            )
          })}
      </div>

      {(overBudgets.length > 0 || warnBudgets.length > 0) && (
        <section className="space-y-2">
          {overBudgets.slice(0, 2).map((budgetItem) => (
            <div
              key={budgetItem.id}
              className="flex items-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-3.5"
            >
              <span className="flex size-9 items-center justify-center rounded-xl bg-red-500/20 text-red-600 dark:text-red-400">
                <AlertTriangle className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-red-700 dark:text-red-300">
                  Budget {budgetItem.category_name} terlampaui
                </p>
                <p className="text-[11px] text-red-600/80 dark:text-red-400/80">
                  {formatRupiah(budgetItem.spent)} / {formatRupiah(budgetItem.amount)} ({(budgetItem.percentage ?? 0).toFixed(0)}%)
                </p>
              </div>
              <Link href="/pengaturan/budget" className="text-xs font-medium text-red-700 dark:text-red-300">
                Atur
              </Link>
            </div>
          ))}
          {overBudgets.length === 0 &&
            warnBudgets.slice(0, 1).map((budgetItem) => (
              <div
                key={budgetItem.id}
                className="flex items-center gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3.5"
              >
                <span className="flex size-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
                  <AlertTriangle className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-amber-700 dark:text-amber-300">
                    Budget {budgetItem.category_name} mendekati batas
                  </p>
                  <p className="text-[11px] text-amber-600/80 dark:text-amber-400/80">
                    {(budgetItem.percentage ?? 0).toFixed(0)}% terpakai
                  </p>
                </div>
                <Link href="/pengaturan/budget" className="text-xs font-medium text-amber-700 dark:text-amber-300">
                  Lihat
                </Link>
              </div>
            ))}
        </section>
      )}

      {chartData.length > 0 && (
        <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <ChartPie className="size-4" />
              </span>
              <div>
                <h2 className="text-base font-semibold tracking-tight">
                  Distribusi Pengeluaran Bulan Ini
                </h2>
                <p className="text-xs text-muted-foreground">
                  Top 5 kategori berdasarkan pengeluaran
                </p>
              </div>
            </div>
            <Link
              href="/rekap"
              className="inline-flex items-center gap-0.5 text-xs font-medium text-indigo-600 transition hover:text-indigo-500 dark:text-indigo-400"
            >
              Lihat rekap
              <ChevronRight className="size-3.5" />
            </Link>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="relative">
              <HomeCategoryChart data={chartData} />
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-[11px] text-muted-foreground">Total</p>
                <p className="text-sm font-semibold">{formatRupiah(month.total)}</p>
              </div>
            </div>
            <div className="flex flex-col justify-center space-y-2.5">
              {chartData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between rounded-xl border border-border/60 px-3 py-2.5"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="size-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <p className="text-sm">{item.name}</p>
                  </div>
                  <p className="text-sm font-medium">{formatRupiah(item.value)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {categoryBudgets.length > 0 && (
        <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold tracking-tight">
                Sisa Budget per Kategori
              </h2>
              <p className="text-xs text-muted-foreground">
                Rincian sisa budget berdasarkan kategori bulan ini
              </p>
            </div>
            <Link
              href="/pengaturan/budget"
              className="inline-flex items-center gap-0.5 text-xs font-medium text-indigo-600 transition hover:text-indigo-500 dark:text-indigo-400"
            >
              Atur budget
              <ChevronRight className="size-3.5" />
            </Link>
          </div>

          <div className="mt-4 space-y-4">
            {categoryBudgets.map((budgetItem) => {
              const color = budgetItem.category_color ?? "#6B7280"
              const spent = budgetItem.spent ?? 0
              const amount = budgetItem.amount ?? 0
              const sisa = amount - spent
              const percentage = budgetItem.percentage ?? 0
              const isOver = budgetItem.status === "over"
              const isWarn = budgetItem.status === "warn"

              return (
                <div key={budgetItem.id} className="space-y-2.5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className="flex size-9 shrink-0 items-center justify-center rounded-xl"
                        style={{
                          backgroundColor: `${color}1f`,
                          color,
                        }}
                      >
                        <AppIcon
                          name={budgetItem.category_icon}
                          className="size-4"
                        />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {budgetItem.category_name}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {formatRupiah(spent)} / {formatRupiah(amount)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={cn(
                          "text-sm font-semibold tracking-tight",
                          isOver
                            ? "text-red-600 dark:text-red-400"
                            : isWarn
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-emerald-600 dark:text-emerald-400",
                        )}
                      >
                        {sisa >= 0 ? formatRupiah(sisa) : `-${formatRupiah(Math.abs(sisa))}`}
                      </p>
                      <p className="text-[11px] text-muted-foreground">Sisa</p>
                    </div>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        isOver
                          ? "bg-red-500"
                          : isWarn
                            ? "bg-amber-500"
                            : "bg-emerald-500",
                      )}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold tracking-tight">
              Pengeluaran terbaru
            </h2>
            <p className="text-xs text-muted-foreground">
              Transaksi terakhir yang kamu catat.
            </p>
          </div>
          <Link
            href="/riwayat"
            className="inline-flex items-center gap-0.5 text-xs font-medium text-indigo-600 transition hover:text-indigo-500 dark:text-indigo-400"
          >
            Lihat semua
            <ChevronRight className="size-3.5" />
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="mt-6 flex flex-col items-center rounded-2xl border border-dashed border-border/80 bg-muted/20 px-4 py-10 text-center">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Wallet className="size-7" />
            </span>
            <p className="mt-4 text-sm font-medium">Belum ada pengeluaran</p>
            <p className="mt-1 max-w-xs text-xs leading-relaxed text-muted-foreground">
              Mulai catat pengeluaran pertamamu agar ringkasan keuangan terlihat
              di sini.
            </p>
            <Button
              type="button"
              onClick={openCreate}
              className="mt-5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-600 hover:to-violet-700"
            >
              <Plus className="size-4" />
              Tambah pengeluaran
            </Button>
          </div>
        ) : (
          <div className="mt-5 divide-y divide-border/50 overflow-hidden rounded-xl border border-border/60">
            {recent.map((expense) => {
              const color = expense.category_color ?? "#6B7280"

              return (
                <div
                  key={expense.id}
                  className="flex items-center gap-3 p-3.5"
                >
                  <span
                    className="flex size-9 shrink-0 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: `${color}1f`,
                      color,
                    }}
                  >
                    <AppIcon
                      name={expense.category_icon}
                      className="size-4"
                    />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="truncate text-sm font-medium">
                        {expense.category_name ?? "Tanpa kategori"}
                      </p>
                      <p className="shrink-0 text-sm font-semibold tracking-tight">
                        {formatRupiah(expense.amount)}
                      </p>
                    </div>
                    <div className="mt-0.5 flex min-w-0 items-center gap-1.5 text-[11px] text-muted-foreground">
                      <span className="shrink-0">
                        {formatTanggal(expense.expense_date, {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                      {expense.payment_method_name && (
                        <>
                          <span aria-hidden>·</span>
                          <span className="truncate">
                            {expense.payment_method_name}
                          </span>
                        </>
                      )}
                      {expense.note && (
                        <>
                          <span aria-hidden>·</span>
                          <span className="truncate">{expense.note}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
