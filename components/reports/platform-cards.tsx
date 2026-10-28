"use client"

import { WalletCards } from "lucide-react"

import { AppIcon } from "@/components/expenses/app-icon"
import { formatRupiah } from "@/lib/utils"
import type { ReportPlatform } from "@/types/reports"

export function PlatformCards({
  platforms,
}: {
  platforms: ReportPlatform[]
}) {
  if (platforms.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-xl border border-dashed border-border/80 bg-muted/20 px-4 py-8 text-center">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <WalletCards className="size-6" />
        </span>
        <p className="mt-3 text-sm font-medium">Belum ada platform</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Rekap platform akan muncul setelah ada transaksi di periode ini.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {platforms.map((platform, index) => {
        const color = platform.color || "var(--chart-1)"
        const percentage = platform.persentase ?? 0

        return (
          <div
            key={platform.payment_method_id ?? `platform-${index}`}
            className="rounded-xl border p-3.5"
            style={{
              borderColor: `color-mix(in srgb, ${color} 28%, transparent)`,
              backgroundColor: `color-mix(in srgb, ${color} 8%, transparent)`,
            }}
          >
            <div className="flex items-start gap-2.5">
              <span
                className="flex size-9 shrink-0 items-center justify-center rounded-xl"
                style={{
                  backgroundColor: `color-mix(in srgb, ${color} 16%, transparent)`,
                  color,
                }}
              >
                <AppIcon name={platform.icon} className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{platform.name}</p>
                <p className="text-[11px] text-muted-foreground">
                  {platform.jumlah_transaksi} transaksi
                </p>
              </div>
              <p className="shrink-0 text-sm font-semibold tracking-tight">
                {formatRupiah(platform.total)}
              </p>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-foreground/10">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min(Math.max(percentage, 0), 100)}%`,
                    backgroundColor: color,
                  }}
                />
              </div>
              <span className="w-10 shrink-0 text-right text-[11px] text-muted-foreground">
                {percentage}%
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
