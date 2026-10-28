import { useQuery } from "@tanstack/react-query"

import {
  fetchDailyReport,
  fetchDashboard,
  fetchMonthlyReport,
  fetchWeeklyReport,
} from "@/lib/data/reports"

export function useDashboard(tanggal: string | null) {
  return useQuery({
    queryKey: ["dashboard", tanggal],
    queryFn: () => fetchDashboard(tanggal as string),
    enabled: Boolean(tanggal),
    staleTime: 60_000,
  })
}

export function useDailyReport(tanggal: string, enabled = true) {
  return useQuery({
    queryKey: ["reports", "harian", tanggal],
    queryFn: () => fetchDailyReport(tanggal),
    enabled,
    staleTime: 60_000,
  })
}

export function useWeeklyReport(anchor: string, enabled = true) {
  return useQuery({
    queryKey: ["reports", "mingguan", anchor],
    queryFn: () => fetchWeeklyReport(anchor),
    enabled,
    staleTime: 60_000,
  })
}

export function useMonthlyReport(anchor: string, enabled = true) {
  return useQuery({
    queryKey: ["reports", "bulanan", anchor],
    queryFn: () => fetchMonthlyReport(anchor),
    enabled,
    staleTime: 60_000,
  })
}
