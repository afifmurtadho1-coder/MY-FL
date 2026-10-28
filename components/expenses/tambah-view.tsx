"use client"

import { CalendarDays, Layers, Plus, Wallet } from "lucide-react"
import { useEffect } from "react"

import { useExpenseSheet } from "@/components/expenses/expense-sheet-provider"
import { Button } from "@/components/ui/button"

const tips = [
  {
    icon: Wallet,
    title: "Nominal otomatis",
    description: "Ketik angka, format Rupiah muncul sendiri.",
  },
  {
    icon: Layers,
    title: "Kategori & platform",
    description: "Pilih ikon berwarna dan chip pembayaran.",
  },
  {
    icon: CalendarDays,
    title: "Tanggal praktis",
    description: "Default hari ini, bisa diubah kapan saja.",
  },
]

export function TambahView() {
  const { openCreate } = useExpenseSheet()

  useEffect(() => {
    openCreate()
  }, [openCreate])

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Catat transaksi baru</p>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Tambah Pengeluaran
        </h1>
      </div>

      <section className="rounded-3xl border border-border/60 bg-card p-6 text-center shadow-sm">
        <span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/25">
          <Plus className="size-8" />
        </span>
        <p className="mt-4 text-base font-semibold tracking-tight">
          Form cepat dalam satu ketukan
        </p>
        <p className="mx-auto mt-1 max-w-sm text-sm leading-relaxed text-muted-foreground">
          Form pengeluaran terbuka otomatis. Kalau tertutup, buka lagi kapan
          saja dari tombol di bawah.
        </p>
        <Button
          type="button"
          onClick={openCreate}
          className="mt-5 h-11 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-5 text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-600 hover:to-violet-700"
        >
          <Plus className="size-4" />
          Buka form pengeluaran
        </Button>
      </section>

      <div className="grid gap-3 sm:grid-cols-3">
        {tips.map((tip) => {
          const Icon = tip.icon

          return (
            <div
              key={tip.title}
              className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm"
            >
              <span className="flex size-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <Icon className="size-4" />
              </span>
              <p className="mt-3 text-sm font-medium">{tip.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {tip.description}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
