"use client"

import { PieChart as PieChartIcon } from "lucide-react"
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts"

import { formatRupiah } from "@/lib/utils"
import type { ReportCategory } from "@/types/reports"

const fallbackColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]

export function MonthlyCategoryDonut({
  categories,
}: {
  categories: ReportCategory[]
}) {
  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-xl border border-dashed border-border/80 bg-muted/20 px-4 py-8 text-center">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <PieChartIcon className="size-6" />
        </span>
        <p className="mt-3 text-sm font-medium">Belum ada kategori</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Donut kategori akan muncul setelah ada transaksi.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-[220px_1fr] sm:items-center">
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categories}
              dataKey="total"
              nameKey="name"
              innerRadius={56}
              outerRadius={88}
              paddingAngle={2}
              strokeWidth={0}
            >
              {categories.map((category, index) => (
                <Cell
                  key={category.category_id ?? `category-${index}`}
                  fill={category.color || fallbackColors[index % fallbackColors.length]}
                />
              ))}
            </Pie>
            <RechartsTooltip
              formatter={(value) => [formatRupiah(Number(value)), "Total"]}
              contentStyle={{
                backgroundColor: "var(--popover)",
                borderColor: "var(--border)",
                borderRadius: 12,
                fontSize: 12,
              }}
              labelStyle={{ color: "var(--muted-foreground)" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
        {categories.map((category, index) => (
          <div
            key={category.category_id ?? `legend-${index}`}
            className="flex items-center gap-2.5"
          >
            <span
              className="size-2.5 shrink-0 rounded-full"
              style={{
                backgroundColor:
                  category.color || fallbackColors[index % fallbackColors.length],
              }}
            />
            <p className="min-w-0 flex-1 truncate text-xs font-medium">
              {category.name}
            </p>
            <p className="shrink-0 text-xs font-semibold tracking-tight">
              {formatRupiah(category.total)}
            </p>
            <p className="w-12 shrink-0 text-right text-[11px] text-muted-foreground">
              {category.persentase ?? 0}%
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
