"use client"

import {
  AlertTriangle,
  ArrowLeft,
  Loader2,
  PiggyBank,
  Plus,
  RotateCcw,
  Trash2,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

import { AppIcon } from "@/components/expenses/app-icon"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import {
  useCategoryBudgets,
  useDeleteCategoryBudget,
  useUpsertCategoryBudget,
} from "@/hooks/use-category-budgets"
import { useCategories } from "@/hooks/use-finance"
import { formatMonthLabel, getTodayKey, startOfMonthKey } from "@/lib/reports-date"
import { cn, formatRupiah } from "@/lib/utils"

export function BudgetSettingsView() {
  const [today, setToday] = useState<string | null>(null)
  const [monthAnchor, setMonthAnchor] = useState<string | null>(null)
  const budgetsQuery = useCategoryBudgets(monthAnchor)
  const categoriesQuery = useCategories()
  const upsert = useUpsertCategoryBudget()
  const remove = useDeleteCategoryBudget()

  useEffect(() => {
    const t = getTodayKey()
    setToday(t)
    setMonthAnchor(startOfMonthKey(t))
  }, [])

  const [selectedCategory, setSelectedCategory] = useState("")
  const [amount, setAmount] = useState("")
  const [saving, setSaving] = useState(false)

  const categories = categoriesQuery.data ?? []
  const budgets = budgetsQuery.data ?? []

  const existingIds = new Set(budgets.map((b: any) => b.category_id))

  async function handleSave() {
    if (!selectedCategory || !amount || !monthAnchor) return
    const num = Number(amount.replace(/[^0-9]/g, ""))
    if (Number.isNaN(num) || num < 0) return
    setSaving(true)
    try {
      await upsert.mutateAsync({
        categoryId: selectedCategory,
        monthKey: monthAnchor,
        amount: num,
      })
      setAmount("")
      setSelectedCategory("")
    } finally {
      setSaving(false)
    }
  }

  if (today === null || monthAnchor === null || budgetsQuery.isLoading || categoriesQuery.isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/pengaturan">
          <Button variant="ghost" size="icon" className="rounded-xl">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <div>
          <p className="text-sm text-muted-foreground">Pengaturan</p>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Budget per kategori
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            {formatMonthLabel(monthAnchor)}
          </p>
        </div>
      </div>

      <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Plus className="size-4" />
          </span>
          <div>
            <h2 className="text-base font-semibold tracking-tight">Tambah budget</h2>
            <p className="text-xs text-muted-foreground">
              Atur batas pengeluaran per kategori untuk bulan ini
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="sm:col-span-1">
            <Label className="text-xs">Kategori</Label>
            <select
              className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Pilih kategori</option>
              {categories
                .filter((c: any) => !existingIds.has(c.id))
                .map((c: any) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="sm:col-span-1">
            <Label className="text-xs">Jumlah budget (Rp)</Label>
            <Input
              className="mt-1.5 rounded-xl"
              placeholder="Contoh: 1000000"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))}
            />
          </div>
          <div className="flex items-end sm:col-span-1">
            <Button
              className="w-full rounded-xl"
              disabled={!selectedCategory || !amount || saving}
              onClick={handleSave}
            >
              {saving ? <Loader2 className="size-4 animate-spin" /> : <PiggyBank className="size-4" />}
              Simpan budget
            </Button>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold tracking-tight">Daftar budget</h2>
            <p className="text-xs text-muted-foreground">
              {budgets.length} kategori memiliki budget
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-xl"
            onClick={() => budgetsQuery.refetch()}
            disabled={budgetsQuery.isFetching}
          >
            <RotateCcw className={cn("size-4", budgetsQuery.isFetching && "animate-spin")} />
            Refresh
          </Button>
        </div>

        {budgets.length === 0 ? (
          <div className="mt-5 flex flex-col items-center rounded-xl border border-dashed border-border/80 bg-muted/20 px-4 py-10 text-center">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <PiggyBank className="size-6" />
            </span>
            <p className="mt-3 text-sm font-medium">Belum ada budget per kategori</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Tambahkan budget untuk memantau pengeluaran per kategori
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {budgets.map((budget) => {
              const pct = budget.percentage ?? 0
              const color =
                budget.status === "over"
                  ? "bg-red-500"
                  : budget.status === "warn"
                    ? "bg-amber-500"
                    : "bg-emerald-500"
              const textColor =
                budget.status === "over"
                  ? "text-red-600 dark:text-red-400"
                  : budget.status === "warn"
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-emerald-600 dark:text-emerald-400"

              return (
                <div
                  key={budget.id}
                  className="rounded-xl border border-border/60 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span
                        className="flex size-9 items-center justify-center rounded-xl"
                        style={{
                          backgroundColor: `${budget.category_color ?? "#6B7280"}1f`,
                          color: budget.category_color ?? "#6B7280",
                        }}
                      >
                        <AppIcon name={budget.category_icon} className="size-4" />
                      </span>
                      <div>
                        <p className="text-sm font-medium">{budget.category_name ?? "Tanpa kategori"}</p>
                        <p className="text-[11px] text-muted-foreground">
                          Terpakai {formatRupiah(budget.spent)} / {formatRupiah(budget.amount)}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-xl text-muted-foreground hover:text-destructive"
                      onClick={() => remove.mutate(budget.id)}
                      disabled={remove.isPending}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>

                  <div className="mt-3">
                    <div className="mb-1.5 flex items-center justify-between text-xs">
                      <span className={cn("font-medium", textColor)}>
                        {budget.status === "over" && <AlertTriangle className="mr-1 inline size-3" />}
                        {pct.toFixed(0)}%
                      </span>
                      <span className="text-muted-foreground">
                        Sisa {formatRupiah(budget.remaining)}
                      </span>
                    </div>
                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn("h-full transition-all", color)}
                        style={{ width: `${Math.min(100, pct)}%` }}
                      />
                    </div>
                    {budget.status === "over" && (
                      <p className="mt-2 text-[11px] text-red-600 dark:text-red-400">
                        Melebihi budget sebesar {formatRupiah(Math.abs(budget.remaining))}
                      </p>
                    )}
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
