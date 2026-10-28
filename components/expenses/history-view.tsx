"use client"

import {
  AlertTriangle,
  BarChart3,
  Download,
  Loader2,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  SearchX,
  SlidersHorizontal,
  Trash2,
  Wallet,
  X,
} from "lucide-react"
import { useMemo, useState } from "react"
import { toast } from "sonner"

import { HistoryTrendChart } from "@/components/history/history-chart"
import { AppIcon } from "@/components/expenses/app-icon"
import { useExpenseSheet } from "@/components/expenses/expense-sheet-provider"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import {
  useCategories,
  useDeleteExpense,
  useExpenses,
  usePaymentMethods,
} from "@/hooks/use-finance"
import { getReadErrorMessage, getWriteErrorMessage } from "@/lib/errors"
import { formatRupiah, formatTanggal } from "@/lib/utils"
import type { Expense } from "@/types/finance"

type ExpenseGroup = {
  date: string
  expenses: Expense[]
  total: number
}

function groupExpenses(expenses: Expense[]): ExpenseGroup[] {
  const groups = new Map<string, Expense[]>()

  for (const expense of expenses) {
    const items = groups.get(expense.expense_date) ?? []
    items.push(expense)
    groups.set(expense.expense_date, items)
  }

  return Array.from(groups.entries()).map(([date, items]) => ({
    date,
    expenses: items,
    total: items.reduce((sum, item) => sum + item.amount, 0),
  }))
}

function HistorySkeleton() {
  return (
    <div className="space-y-5">
      {Array.from({ length: 3 }).map((_, groupIndex) => (
        <div key={groupIndex} className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="overflow-hidden rounded-2xl border border-border/60 bg-card">
            {Array.from({ length: groupIndex === 0 ? 3 : 2 }).map(
              (_, itemIndex) => (
                <div
                  key={itemIndex}
                  className="flex items-center gap-3 border-b border-border/50 p-4 last:border-b-0"
                >
                  <Skeleton className="size-10 shrink-0 rounded-xl" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton className="h-3.5 w-2/3" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                  <Skeleton className="h-4 w-20" />
                </div>
              ),
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export function HistoryView() {
  const { openCreate, openEdit } = useExpenseSheet()
  const [search, setSearch] = useState("")
  const [categoryId, setCategoryId] = useState("all")
  const [paymentMethodId, setPaymentMethodId] = useState("all")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [deleteTarget, setDeleteTarget] = useState<Expense | null>(null)

  const debouncedSearch = useDebouncedValue(search.trim(), 300)
  const categoriesQuery = useCategories()
  const paymentMethodsQuery = usePaymentMethods()
  const deleteMutation = useDeleteExpense()

  const filters = useMemo(
    () => ({
      categoryId,
      paymentMethodId,
      dateFrom,
      dateTo,
      search: debouncedSearch,
    }),
    [categoryId, paymentMethodId, dateFrom, dateTo, debouncedSearch],
  )

  const expensesQuery = useExpenses(filters)
  const expenses = useMemo(() => expensesQuery.data ?? [], [expensesQuery.data])
  const groups = useMemo(() => groupExpenses(expenses), [expenses])
  const categories = categoriesQuery.data ?? []
  const paymentMethods = paymentMethodsQuery.data ?? []

  const chartData = useMemo(() => {
    const sliced = groups.slice(0, 10).reverse()
    return sliced.map((group) => {
      const dateObj = new Date(group.date)
      const label = dateObj.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
      })
      return {
        date: group.date,
        label,
        total: group.total,
        count: group.expenses.length,
      }
    })
  }, [groups])

  const hasFilters =
    search.trim() !== "" ||
    categoryId !== "all" ||
    paymentMethodId !== "all" ||
    dateFrom !== "" ||
    dateTo !== ""

  function exportCsv() {
    const rows = expenses
    if (rows.length === 0) {
      toast.error("Tidak ada data untuk diekspor")
      return
    }

    const header = ["tanggal", "kategori", "metode_pembayaran", "catatan", "jumlah"]
    const csvRows = [header.join(",")]
    for (const r of rows) {
      const kategori = (r.category?.name ?? "Tanpa Kategori").replace(/"/g, '""')
      const metode = (r.payment_method?.name ?? "-").replace(/"/g, '""')
      const catatan = (r.note ?? "").replace(/"/g, '""')
      csvRows.push([
        r.expense_date,
        `"${kategori}"`,
        `"${metode}"`,
        `"${catatan}"`,
        r.amount,
      ].join(","))
    }

    const blob = new Blob(["\ufeff" + csvRows.join("\n")], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `transaksi-${new Date().toISOString().slice(0, 10)}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success("CSV berhasil diunduh")
  }

  function resetFilters() {
    setSearch("")
    setCategoryId("all")
    setPaymentMethodId("all")
    setDateFrom("")
    setDateTo("")
  }

  async function handleDelete() {
    if (!deleteTarget) {
      return
    }

    try {
      await deleteMutation.mutateAsync(deleteTarget.id)
      toast.success("Transaksi dihapus", {
        description: "Pengeluaran sudah dihapus dari riwayat.",
      })
      setDeleteTarget(null)
    } catch (error) {
      toast.error("Gagal menghapus", {
        description: getWriteErrorMessage(error),
      })
    }
  }

  const totalFiltered = expenses.reduce((sum, item) => sum + item.amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">Semua transaksi</p>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Riwayat
          </h1>
        </div>
        <Button
          type="button"
          onClick={openCreate}
          className="h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-4 text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-600 hover:to-violet-700"
        >
          <Plus className="size-4" />
          Tambah
        </Button>
      </div>

      <section className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <SlidersHorizontal className="size-4" />
            </span>
            <div>
              <p className="text-sm font-semibold tracking-tight">Filter</p>
              <p className="text-[11px] text-muted-foreground">
                {expensesQuery.isFetching && !expensesQuery.isLoading
                  ? "Memperbarui data..."
                  : `${expenses.length} transaksi · ${formatRupiah(totalFiltered)}`}
              </p>
            </div>
          </div>
          {hasFilters && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="text-muted-foreground"
            >
              <RotateCcw className="size-3.5" />
              Reset
            </Button>
          )}
        </div>

        <div className="mt-3 flex justify-end">
          <Button variant="outline" size="sm" onClick={exportCsv} className="rounded-xl">
            <Download className="size-4" />
            Export CSV
          </Button>
        </div>

        <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
          <div className="relative sm:col-span-2">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari catatan transaksi..."
              className="h-10 rounded-xl bg-background/60 pl-9 pr-9"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Hapus pencarian"
                className="absolute inset-y-0 right-0 flex w-9 items-center justify-center text-muted-foreground transition hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          <div className="space-y-1.5">
            <p className="text-[11px] font-medium text-muted-foreground">
              Kategori
            </p>
            <Select
              value={categoryId}
              onValueChange={(value) => setCategoryId(String(value ?? "all"))}
            >
              <SelectTrigger className="h-10 w-full justify-between rounded-xl bg-background/60">
                <SelectValue placeholder="Semua kategori">
                  {(value) =>
                    value === "all" || !value
                      ? "Semua kategori"
                      : (categories.find((item) => item.id === value)?.name ??
                        "Semua kategori")
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua kategori</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <p className="text-[11px] font-medium text-muted-foreground">
              Platform
            </p>
            <Select
              value={paymentMethodId}
              onValueChange={(value) =>
                setPaymentMethodId(String(value ?? "all"))
              }
            >
              <SelectTrigger className="h-10 w-full justify-between rounded-xl bg-background/60">
                <SelectValue placeholder="Semua platform">
                  {(value) =>
                    value === "all" || !value
                      ? "Semua platform"
                      : (paymentMethods.find((item) => item.id === value)
                          ?.name ?? "Semua platform")
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua platform</SelectItem>
                {paymentMethods.map((method) => (
                  <SelectItem key={method.id} value={method.id}>
                    {method.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <p className="text-[11px] font-medium text-muted-foreground">
              Dari tanggal
            </p>
            <Input
              type="date"
              value={dateFrom}
              max={dateTo || undefined}
              onChange={(event) => setDateFrom(event.target.value)}
              className="h-10 rounded-xl bg-background/60"
            />
          </div>

          <div className="space-y-1.5">
            <p className="text-[11px] font-medium text-muted-foreground">
              Sampai tanggal
            </p>
            <Input
              type="date"
              value={dateTo}
              min={dateFrom || undefined}
              onChange={(event) => setDateTo(event.target.value)}
              className="h-10 rounded-xl bg-background/60"
            />
          </div>
        </div>

        {(categoriesQuery.isError || paymentMethodsQuery.isError) && (
          <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 px-3 py-2.5">
            <p className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400">
              <AlertTriangle className="size-4 shrink-0" />
              Sebagian pilihan filter gagal dimuat.
            </p>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => {
                if (categoriesQuery.isError) {
                  categoriesQuery.refetch()
                }
                if (paymentMethodsQuery.isError) {
                  paymentMethodsQuery.refetch()
                }
              }}
            >
              Coba lagi
            </Button>
          </div>
        )}
      </section>

      {expensesQuery.isLoading && <HistorySkeleton />}

      {expensesQuery.isError && (
        <section className="flex flex-col items-center rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-10 text-center">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <AlertTriangle className="size-7" />
          </span>
          <p className="mt-4 text-sm font-medium">Gagal memuat riwayat</p>
          <p className="mt-1 max-w-xs text-xs leading-relaxed text-muted-foreground">
            {getReadErrorMessage(expensesQuery.error)}
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => expensesQuery.refetch()}
            disabled={expensesQuery.isFetching}
            className="mt-5 rounded-xl"
          >
            {expensesQuery.isFetching ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <RotateCcw className="size-4" />
            )}
            Coba lagi
          </Button>
        </section>
      )}

      {!expensesQuery.isLoading &&
        !expensesQuery.isError &&
        expenses.length === 0 && (
          <section className="flex flex-col items-center rounded-2xl border border-dashed border-border/80 bg-muted/20 px-4 py-12 text-center">
            <span className="flex size-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              {hasFilters ? (
                <SearchX className="size-8" />
              ) : (
                <Wallet className="size-8" />
              )}
            </span>
            <p className="mt-4 text-sm font-medium">
              {hasFilters
                ? "Tidak ada transaksi yang cocok"
                : "Belum ada pengeluaran"}
            </p>
            <p className="mt-1 max-w-xs text-xs leading-relaxed text-muted-foreground">
              {hasFilters
                ? "Coba ubah kata kunci, kategori, platform, atau rentang tanggal."
                : "Mulai catat pengeluaran pertamamu. Riwayat akan tersusun rapi per tanggal."}
            </p>
            {hasFilters ? (
              <Button
                type="button"
                variant="outline"
                onClick={resetFilters}
                className="mt-5 rounded-xl"
              >
                <RotateCcw className="size-4" />
                Reset filter
              </Button>
            ) : (
              <Button
                type="button"
                onClick={openCreate}
                className="mt-5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-600 hover:to-violet-700"
              >
                <Plus className="size-4" />
                Tambah pengeluaran
              </Button>
            )}
          </section>
        )}

      {!expensesQuery.isLoading &&
        !expensesQuery.isError &&
        expenses.length > 0 &&
        !hasFilters &&
        chartData.length > 0 && (
          <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <BarChart3 className="size-4" />
                </span>
                <div>
                  <h2 className="text-base font-semibold tracking-tight">
                    Grafik Pengeluaran 10 Hari Terakhir
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Tren harian berdasarkan total pengeluaran
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <HistoryTrendChart data={chartData} />
            </div>
          </section>
        )}

      {groups.length > 0 && (
        <div className="space-y-5">
          {groups.map((group) => (
            <section key={group.date}>
              <div className="mb-2 flex items-end justify-between gap-3 px-1">
                <div>
                  <p className="text-sm font-semibold tracking-tight">
                    {formatTanggal(group.date, {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {group.expenses.length} transaksi
                  </p>
                </div>
                <p className="text-sm font-semibold tracking-tight">
                  {formatRupiah(group.total)}
                </p>
              </div>

              <div className="divide-y divide-border/50 overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
                {group.expenses.map((expense) => {
                  const color = expense.category?.color ?? "#6B7280"
                  const methodColor =
                    expense.payment_method?.color ?? "#6B7280"

                  return (
                    <div
                      key={expense.id}
                      className="flex items-start gap-3 p-3.5 sm:p-4"
                    >
                      <span
                        className="flex size-10 shrink-0 items-center justify-center rounded-xl"
                        style={{
                          backgroundColor: `${color}1f`,
                          color,
                        }}
                      >
                        <AppIcon
                          name={expense.category?.icon}
                          className="size-4"
                        />
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="truncate text-sm font-medium">
                            {expense.category?.name ?? "Tanpa kategori"}
                          </p>
                          <p className="shrink-0 text-sm font-semibold tracking-tight">
                            {formatRupiah(expense.amount)}
                          </p>
                        </div>

                        <div className="mt-1 flex min-w-0 flex-wrap items-center gap-1.5">
                          {expense.payment_method && (
                            <Badge
                              variant="outline"
                              className="h-5 gap-1 border-transparent px-1.5 text-[10px]"
                              style={{
                                backgroundColor: `${methodColor}14`,
                                color: methodColor,
                              }}
                            >
                              <span
                                className="size-1.5 rounded-full"
                                style={{ backgroundColor: methodColor }}
                              />
                              {expense.payment_method.name}
                            </Badge>
                          )}
                          {expense.note && (
                            <p className="min-w-0 max-w-full truncate text-xs text-muted-foreground">
                              {expense.note}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-0.5">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => openEdit(expense)}
                          aria-label="Edit transaksi"
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Pencil className="size-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setDeleteTarget(expense)}
                          aria-label="Hapus transaksi"
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      )}

      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open && !deleteMutation.isPending) {
            setDeleteTarget(null)
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus transaksi ini?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget
                ? `${deleteTarget.category?.name ?? "Tanpa kategori"} · ${formatRupiah(deleteTarget.amount)} akan dihapus permanen.`
                : "Transaksi akan dihapus permanen."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Batal
            </AlertDialogCancel>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Trash2 className="size-4" />
              )}
              {deleteMutation.isPending ? "Menghapus..." : "Hapus"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

