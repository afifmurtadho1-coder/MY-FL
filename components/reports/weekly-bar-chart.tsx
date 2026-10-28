"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts"

import { formatChartDay, formatDayLabel } from "@/lib/reports-date"
import { formatRupiah, formatRupiahCompact } from "@/lib/utils"
import type { DailyPoint } from "@/types/reports"

export function WeeklyBarChart({ data }: { data: DailyPoint[] }) {
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="var(--border)"
          />
          <XAxis
            dataKey="tanggal"
            tickFormatter={formatChartDay}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
          />
          <YAxis
            width={44}
            tickFormatter={(value) => formatRupiahCompact(Number(value))}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
          />
          <RechartsTooltip
            cursor={{ fill: "var(--muted)", opacity: 0.45 }}
            formatter={(value) => [formatRupiah(Number(value)), "Pengeluaran"]}
            labelFormatter={(label) => formatDayLabel(String(label))}
            contentStyle={{
              backgroundColor: "var(--popover)",
              borderColor: "var(--border)",
              borderRadius: 12,
              fontSize: 12,
            }}
            labelStyle={{ color: "var(--muted-foreground)" }}
          />
          <Bar
            dataKey="total"
            fill="var(--chart-1)"
            radius={[8, 8, 0, 0]}
            maxBarSize={36}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
