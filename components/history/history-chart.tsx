"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { formatRupiah } from "@/lib/utils"

type HistoryChartPoint = {
  date: string
  label: string
  total: number
  count: number
}

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{ payload: HistoryChartPoint }>
}) => {
  if (!active || !payload?.length) return null

  const data = payload[0].payload

  return (
    <div className="rounded-xl border border-border/60 bg-card px-3 py-2 shadow-xl">
      <p className="text-xs text-muted-foreground">{data.label}</p>
      <p className="text-sm font-semibold">{formatRupiah(data.total)}</p>
      <p className="text-[11px] text-muted-foreground">
        {data.count} transaksi
      </p>
    </div>
  )
}

export function HistoryTrendChart({ data }: { data: HistoryChartPoint[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-[240px] items-center justify-center text-xs text-muted-foreground">
        Belum ada data untuk grafik
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.6} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={(value) =>
            value >= 1000000
              ? `${(value / 1000000).toFixed(1)}jt`
              : value >= 1000
                ? `${(value / 1000).toFixed(0)}rb`
                : value
          }
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          axisLine={false}
          tickLine={false}
          width={40}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(99,102,241,0.08)" }} />
        <Bar
          dataKey="total"
          radius={[10, 10, 6, 6]}
          fill="url(#historyGradient)"
          maxBarSize={38}
        />
        <defs>
          <linearGradient id="historyGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.7} />
          </linearGradient>
        </defs>
      </BarChart>
    </ResponsiveContainer>
  )
}
