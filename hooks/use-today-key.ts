"use client"

import { useEffect, useState } from "react"

import { getTodayKey } from "@/lib/reports-date"

export function useTodayKey() {
  const [today, setToday] = useState<string | null>(null)

  useEffect(() => {
    setToday(getTodayKey())
  }, [])

  return today
}
