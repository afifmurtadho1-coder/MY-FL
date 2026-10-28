"use client"

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts"

import { formatChartDayNumber, formatDayLabel } from "@/lib/reports-date"
import { formatRupiah, formatRupiahCompact } from "@/lib/utils"
import type { DailyPoint } from "@/types/reports"

export function MonthlyTrendChart({ data }: { data: DailyPoint[] }) {
  const interval = data.length > 12 ? Math.floor(data.length / 6) : 0

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="var(--border)"
          />
          <XAxis
            dataKey="tanggal"
            tickFormatter={formatChartDayNumber}
            interval={interval}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
          />
          <YAxis
            width={44}
            tickFormatter={(value) => formatRupiahCompact(Number(value))}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
          />
          <RechartsTooltip
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
          <Line
            type="monotone"
            dataKey="total"
            stroke="var(--chart-2)"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
