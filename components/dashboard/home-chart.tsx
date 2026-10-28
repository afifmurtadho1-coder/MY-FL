"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

import { formatRupiah } from "@/lib/utils"

type ChartItem = {
  name: string
  value: number
  color: string
}

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{ payload: ChartItem }>
}) => {
  if (!active || !payload?.length) return null

  const data = payload[0].payload

  return (
    <div className="rounded-xl border border-border/60 bg-card px-3 py-2 shadow-xl">
      <p className="text-xs text-muted-foreground">{data.name}</p>
      <p className="text-sm font-semibold">{formatRupiah(data.value)}</p>
    </div>
  )
}

export function HomeCategoryChart({ data }: { data: ChartItem[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-[220px] items-center justify-center text-xs text-muted-foreground">
        Belum ada pengeluaran bulan ini
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={65}
          outerRadius={90}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  )
}
