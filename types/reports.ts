export type DailyPoint = {
  tanggal: string
  total: number
  jumlah_transaksi: number
}

export type ReportCategory = {
  category_id: string | null
  name: string
  icon: string
  color: string
  total: number
  jumlah_transaksi: number
  persentase: number | null
}

export type ReportPlatform = {
  payment_method_id: string | null
  name: string
  icon: string
  color: string
  total: number
  jumlah_transaksi: number
  persentase: number | null
}

export type ReportTransaction = {
  id: string
  amount: number
  note: string | null
  expense_date: string
  created_at?: string
  category_id?: string | null
  category_name: string | null
  category_icon: string | null
  category_color: string | null
  payment_method_id?: string | null
  payment_method_name: string | null
  payment_method_icon: string | null
  payment_method_color: string | null
}

export type DailySummary = {
  tanggal: string
  total: number
  jumlah_transaksi: number
  transaksi: ReportTransaction[]
}

export type WeeklySummary = {
  mulai: string
  selesai: string
  total: number
  jumlah_transaksi: number
  rata_rata_harian: number
  harian: DailyPoint[]
}

export type MonthlySummary = {
  bulan: string
  total: number
  jumlah_transaksi: number
  rata_rata_harian: number
  harian: DailyPoint[]
  per_kategori: ReportCategory[]
  top_transaksi: ReportTransaction[]
}

export type CategorySummary = {
  mulai: string
  selesai: string
  total: number
  jumlah_transaksi: number
  per_kategori: ReportCategory[]
}

export type PlatformSummary = {
  mulai: string
  selesai: string
  total: number
  jumlah_transaksi: number
  platform: ReportPlatform[]
}

export type ComparisonPeriod = {
  mulai: string
  selesai: string
  total: number
  jumlah_transaksi: number
}

export type Comparison = {
  periode_ini: ComparisonPeriod
  periode_sebelumnya: ComparisonPeriod
  selisih: number
  persentase_perubahan: number | null
}

export type BudgetSummary = {
  bulan: string
  total_budget: number
  total_pengeluaran: number
  sisa: number
  persentase_terpakai: number | null
}

export type DashboardData = {
  today: DailySummary
  week: WeeklySummary
  month: MonthlySummary
  budget: BudgetSummary
  recent: ReportTransaction[]
}

export type DailyReport = {
  summary: DailySummary
  comparison: Comparison
  platforms: PlatformSummary
}

export type WeeklyReport = {
  summary: WeeklySummary
  categories: CategorySummary
  comparison: Comparison
  platforms: PlatformSummary
}

export type MonthlyReport = {
  summary: MonthlySummary
  comparison: Comparison
  platforms: PlatformSummary
}
