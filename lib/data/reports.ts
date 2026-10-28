import { getMonthRange, getWeekRange } from "@/lib/reports-date"
import { createClient } from "@/lib/supabase/client"
import type {
  BudgetSummary,
  CategorySummary,
  Comparison,
  DailyReport,
  DailySummary,
  DashboardData,
  MonthlyReport,
  MonthlySummary,
  PlatformSummary,
  ReportTransaction,
  WeeklyReport,
  WeeklySummary,
} from "@/types/reports"

async function callRpc<T>(
  name: string,
  args?: Record<string, unknown>,
): Promise<T> {
  const supabase = createClient()
  const { data, error } = await supabase.rpc(name, args)

  if (error) {
    throw new Error(error.message)
  }

  return data as T
}

export async function fetchDashboard(tanggal: string): Promise<DashboardData> {
  const [today, week, month, budget, recent] = await Promise.all([
    callRpc<DailySummary>("rekap_harian", { p_tanggal: tanggal }),
    callRpc<WeeklySummary>("rekap_mingguan", { p_tanggal: tanggal }),
    callRpc<MonthlySummary>("rekap_bulanan", { p_bulan: tanggal }),
    callRpc<BudgetSummary>("ringkasan_budget", { p_bulan: tanggal }),
    callRpc<ReportTransaction[]>("transaksi_terbaru", { p_limit: 5 }),
  ])

  return { today, week, month, budget, recent }
}

export async function fetchDailyReport(tanggal: string): Promise<DailyReport> {
  const [summary, comparison, platforms] = await Promise.all([
    callRpc<DailySummary>("rekap_harian", { p_tanggal: tanggal }),
    callRpc<Comparison>("perbandingan_periode", {
      p_mulai: tanggal,
      p_selesai: tanggal,
    }),
    callRpc<PlatformSummary>("rekap_per_platform", {
      p_mulai: tanggal,
      p_selesai: tanggal,
    }),
  ])

  return { summary, comparison, platforms }
}

export async function fetchWeeklyReport(anchor: string): Promise<WeeklyReport> {
  const { start, end } = getWeekRange(anchor)
  const [summary, categories, comparison, platforms] = await Promise.all([
    callRpc<WeeklySummary>("rekap_mingguan", { p_tanggal: anchor }),
    callRpc<CategorySummary>("rekap_kategori", {
      p_mulai: start,
      p_selesai: end,
    }),
    callRpc<Comparison>("perbandingan_periode", {
      p_mulai: start,
      p_selesai: end,
    }),
    callRpc<PlatformSummary>("rekap_per_platform", {
      p_mulai: start,
      p_selesai: end,
    }),
  ])

  return { summary, categories, comparison, platforms }
}

export async function fetchMonthlyReport(anchor: string): Promise<MonthlyReport> {
  const { start, end } = getMonthRange(anchor)
  const [summary, comparison, platforms] = await Promise.all([
    callRpc<MonthlySummary>("rekap_bulanan", { p_bulan: anchor }),
    callRpc<Comparison>("perbandingan_periode", {
      p_mulai: start,
      p_selesai: end,
    }),
    callRpc<PlatformSummary>("rekap_per_platform", {
      p_mulai: start,
      p_selesai: end,
    }),
  ])

  return { summary, comparison, platforms }
}
