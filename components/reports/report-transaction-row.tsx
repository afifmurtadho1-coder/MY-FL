"use client"

import { AppIcon } from "@/components/expenses/app-icon"
import { Badge } from "@/components/ui/badge"
import { formatRupiah, formatTanggal } from "@/lib/utils"
import type { ReportTransaction } from "@/types/reports"

export function ReportTransactionRow({
  expense,
  rank,
  showDate = false,
}: {
  expense: ReportTransaction
  rank?: number
  showDate?: boolean
}) {
  const color = expense.category_color ?? "#6B7280"
  const methodColor = expense.payment_method_color ?? "#6B7280"

  return (
    <div className="flex items-start gap-3 p-3.5">
      {rank != null ? (
        <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-muted-foreground">
          {rank}
        </span>
      ) : null}

      <span
        className="flex size-10 shrink-0 items-center justify-center rounded-xl"
        style={{
          backgroundColor: `${color}1f`,
          color,
        }}
      >
        <AppIcon name={expense.category_icon} className="size-4" />
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

        <div className="mt-1 flex min-w-0 flex-wrap items-center gap-1.5">
          {showDate && (
            <span className="text-[11px] text-muted-foreground">
              {formatTanggal(expense.expense_date, {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          )}
          {expense.payment_method_name && (
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
              {expense.payment_method_name}
            </Badge>
          )}
          {expense.note && (
            <p className="min-w-0 max-w-full truncate text-xs text-muted-foreground">
              {expense.note}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
