"use client"

import {
  ArrowDownLeft,
  ArrowUpRight,
  Baby,
  HeartPulse,
  Home,
  PiggyBank,
  Plus,
  Target,
  TrendingUp,
  Wallet,
} from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { formatRupiah } from "@/lib/utils"
import { SAVING_CATEGORIES, type Saving, type SavingCategory } from "@/types/savings"
import { useSavings } from "@/hooks/use-savings"

function getCategoryMeta(category: SavingCategory) {
  return (
    SAVING_CATEGORIES.find((item) => item.value === category) ??
    SAVING_CATEGORIES[SAVING_CATEGORIES.length - 1]
  )
}

function getCategoryIcon(category: SavingCategory) {
  const meta = getCategoryMeta(category)
  if (meta.icon === "trending-up") return TrendingUp
  if (meta.icon === "baby") return Baby
  if (meta.icon === "heart-pulse") return HeartPulse
  if (meta.icon === "home") return Home
  return PiggyBank
}

function SavingsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-4 w-24 rounded bg-muted" />
          <div className="h-8 w-40 rounded bg-muted" />
        </div>
        <div className="h-10 w-36 rounded-xl bg-muted" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-48 rounded-2xl border bg-card" />
        ))}
      </div>
    </div>
  )
}

export function SavingsView() {
  const { data: savings = [], isLoading } = useSavings()
  const [showInfo, setShowInfo] = useState(false)

  if (isLoading) return <SavingsSkeleton />

  const totalTarget = savings.reduce((sum, item) => sum + Number(item.target_amount || 0), 0)
  const totalCurrent = savings.reduce((sum, item) => sum + Number(item.current_amount || 0), 0)
  const totalProgress = totalTarget > 0 ? Math.min((totalCurrent / totalTarget) * 100, 100) : 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Keuangan</p>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Tabungan & Target
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Pantau progres tabungan dan target keuangan kamu
          </p>
        </div>
        <Button className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/20">
          <Plus className="size-4" />
          Buat Target Baru
        </Button>
      </div>

      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 p-6 text-white shadow-2xl shadow-emerald-500/20 sm:p-8">
        <div
          aria-hidden
          className="absolute -right-10 -top-16 size-48 rounded-full bg-white/10 blur-2xl"
        />
        <div
          aria-hidden
          className="absolute -bottom-20 left-1/3 size-48 rounded-full bg-white/10 blur-3xl"
        />

        <div className="relative">
          <div className="flex items-center justify-between gap-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
              <PiggyBank className="size-3.5" />
              Total Tabungan
            </span>
            <Target className="size-5 text-white/70" />
          </div>

          <p className="mt-7 text-sm text-emerald-50">Terkumpul / Target</p>
          <p className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
            {formatRupiah(totalCurrent)}{" "}
            <span className="text-lg font-normal text-emerald-100 sm:text-xl">
              / {formatRupiah(totalTarget)}
            </span>
          </p>

          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-between text-xs text-emerald-50">
              <span>Progres keseluruhan</span>
              <span>{totalProgress.toFixed(1)}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-white transition-all"
                style={{ width: `${totalProgress}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold tracking-tight">
              Rekomendasi Kategori Tabungan
            </h2>
            <p className="text-xs text-muted-foreground">
              Saran pembagian target tabungan sesuai kebutuhan keluarga
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-xl"
            onClick={() => setShowInfo(!showInfo)}
          >
            {showInfo ? "Tutup" : "Lihat saran"}
          </Button>
        </div>

        {showInfo && (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {SAVING_CATEGORIES.map((category) => {
              const Icon = getCategoryIcon(category.value)
              return (
                <div
                  key={category.value}
                  className="flex items-start gap-3 rounded-xl border border-border/60 p-3"
                >
                  <span
                    className="flex size-9 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: `${category.color}1f`,
                      color: category.color,
                    }}
                  >
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{category.label}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {category.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {savings.length === 0 ? (
        <section className="flex flex-col items-center rounded-2xl border border-dashed border-border/80 bg-muted/20 px-4 py-12 text-center">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <PiggyBank className="size-7" />
          </span>
          <p className="mt-4 text-sm font-medium">Belum ada target tabungan</p>
          <p className="mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground">
            Buat target pertamamu seperti tabungan beli rumah, dana melahirkan, atau investasi. Kamu bisa set target nominal dan mulai setor rutin.
          </p>
          <Button className="mt-5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white">
            <Plus className="size-4" />
            Buat Target Pertama
          </Button>
        </section>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {savings.map((saving: Saving) => {
            const meta = getCategoryMeta(saving.category)
            const Icon = getCategoryIcon(saving.category)
            const progress = Math.min(
              (Number(saving.current_amount) / Number(saving.target_amount)) * 100,
              100,
            )
            const sisa = Number(saving.target_amount) - Number(saving.current_amount)

            return (
              <article
                key={saving.id}
                className="relative overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm"
              >
                <div className="flex items-start justify-between gap-4 p-5">
                  <div className="flex items-start gap-3">
                    <span
                      className="flex size-10 items-center justify-center rounded-xl"
                      style={{
                        backgroundColor: `${meta.color}1f`,
                        color: meta.color,
                      }}
                    >
                      <Icon className="size-5" />
                    </span>
                    <div>
                      <p className="font-medium">{saving.name}</p>
                      <p className="text-xs text-muted-foreground">{meta.label}</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                    {saving.status === "berjalan"
                      ? "Berjalan"
                      : saving.status === "tercapai"
                        ? "Tercapai"
                        : "Berhenti"}
                  </span>
                </div>

                <div className="px-5 pb-5">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Terkumpul</p>
                      <p className="mt-1 text-lg font-semibold tracking-tight">
                        {formatRupiah(saving.current_amount)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Target</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {formatRupiah(saving.target_amount)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{progress.toFixed(1)}% tercapai</span>
                      <span>
                        {sisa > 0 ? `Sisa ${formatRupiah(sisa)}` : "Target tercapai 🎉"}
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${progress}%`,
                          background: `linear-gradient(90deg, ${meta.color}, ${meta.color}dd)`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="mt-5 flex items-center gap-2">
                    <Button size="sm" className="flex-1 rounded-xl">
                      <ArrowDownLeft className="size-4" />
                      Setor
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 rounded-xl">
                      <ArrowUpRight className="size-4" />
                      Tarik
                    </Button>
                    <Button size="sm" variant="ghost" className="rounded-xl">
                      <Wallet className="size-4" />
                    </Button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
