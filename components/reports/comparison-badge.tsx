"use client"

import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react"

import { formatRupiah } from "@/lib/utils"
import type { Comparison } from "@/types/reports"

export function ComparisonBadge({
  comparison,
  label,
}: {
  comparison: Comparison
  label: string
}) {
  const percentage = comparison.persentase_perubahan
  const isUp = percentage != null && percentage > 0
  const isDown = percentage != null && percentage < 0
  const Icon = isUp ? ArrowUpRight : isDown ? ArrowDownRight : Minus
  const tone = isUp
    ? "bg-red-500/10 text-red-600 dark:text-red-400"
    : isDown
      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
      : "bg-muted text-muted-foreground"

  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-xl border border-border/60 bg-muted/20 px-3 py-2">
      <span
        className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-semibold ${tone}`}
      >
        <Icon className="size-3.5" />
        {percentage != null ? `${Math.abs(percentage)}%` : "—"}
      </span>
      <span className="text-xs text-muted-foreground">{label}</span>
      {percentage != null && (
        <span className="text-[11px] text-muted-foreground">
          · {formatRupiah(Math.abs(comparison.selisih))}{" "}
          {isUp ? "lebih tinggi" : isDown ? "lebih rendah" : "sama"}
        </span>
      )}
      {percentage == null && (
        <span className="text-[11px] text-muted-foreground">
          · belum ada data pembanding
        </span>
      )}
    </div>
  )
}
