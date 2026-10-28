"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  formatDayLabel,
  formatMonthLabel,
  formatWeekLabel,
  shiftDay,
  shiftMonth,
  shiftWeek,
  startOfMonthKey,
  startOfWeekKey,
} from "@/lib/reports-date"

type PeriodMode = "day" | "week" | "month"

const modeLabels: Record<PeriodMode, string> = {
  day: "Harian",
  week: "Mingguan · Senin–Minggu",
  month: "Bulanan",
}

export function PeriodPicker({
  mode,
  value,
  onChange,
  today,
}: {
  mode: PeriodMode
  value: string
  onChange: (value: string) => void
  today: string
}) {
  const currentKey =
    mode === "day"
      ? today
      : mode === "week"
        ? startOfWeekKey(today)
        : startOfMonthKey(today)

  const canGoNext =
    mode === "day"
      ? value < today
      : mode === "week"
        ? value < startOfWeekKey(today)
        : value < startOfMonthKey(today)

  const label =
    mode === "day"
      ? formatDayLabel(value)
      : mode === "week"
        ? formatWeekLabel(value)
        : formatMonthLabel(value)

  function goPrevious() {
    if (mode === "day") {
      onChange(shiftDay(value, -1))
    } else if (mode === "week") {
      onChange(shiftWeek(value, -1))
    } else {
      onChange(shiftMonth(value, -1))
    }
  }

  function goNext() {
    if (mode === "day") {
      onChange(shiftDay(value, 1))
    } else if (mode === "week") {
      onChange(shiftWeek(value, 1))
    } else {
      onChange(shiftMonth(value, 1))
    }
  }

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-3 shadow-sm">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={goPrevious}
          aria-label="Periode sebelumnya"
          className="size-9 shrink-0 rounded-xl"
        >
          <ChevronLeft className="size-4" />
        </Button>

        <div className="min-w-0 flex-1 text-center">
          <p className="truncate text-sm font-semibold tracking-tight">
            {label}
          </p>
          <p className="text-[11px] text-muted-foreground">
            {modeLabels[mode]}
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={goNext}
          disabled={!canGoNext}
          aria-label="Periode berikutnya"
          className="size-9 shrink-0 rounded-xl"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>

      {mode === "day" ? (
        <Input
          type="date"
          value={value}
          max={today}
          onChange={(event) => {
            if (event.target.value) {
              onChange(event.target.value)
            }
          }}
          className="mt-3 h-10 rounded-xl bg-background/60"
        />
      ) : (
        value !== currentKey && (
          <div className="mt-2 flex justify-center">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onChange(currentKey)}
            >
              {mode === "week" ? "Kembali ke minggu ini" : "Kembali ke bulan ini"}
            </Button>
          </div>
        )
      )}
    </div>
  )
}
