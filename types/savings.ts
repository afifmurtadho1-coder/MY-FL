export type SavingCategory =
  | "investasi"
  | "tabungan_anak"
  | "tabungan_istri_melahirkan"
  | "tabungan_beli_rumah"
  | "tabungan_lainnya"

export type SavingStatus = "berjalan" | "tercapai" | "berhenti"

export type Saving = {
  id: string
  user_id: string
  name: string
  category: SavingCategory
  target_amount: number
  current_amount: number
  start_date: string
  target_date: string | null
  status: SavingStatus
  icon: string | null
  color: string | null
  note: string | null
  created_at: string
  updated_at: string
  progress_percentage: number
  sisa_target: number
}

export type SavingTransactionType = "deposit" | "withdraw"

export type SavingTransaction = {
  id: string
  saving_id: string
  user_id: string
  amount: number
  type: SavingTransactionType
  transaction_date: string
  note: string | null
  created_at: string
}

export const SAVING_CATEGORIES: Array<{
  value: SavingCategory
  label: string
  description: string
  icon: string
  color: string
}> = [
  {
    value: "investasi",
    label: "Investasi",
    description: "Reksa dana, saham, emas, atau instrumen investasi lain",
    icon: "trending-up",
    color: "#22c55e",
  },
  {
    value: "tabungan_anak",
    label: "Tabungan Anak",
    description: "Dana pendidikan atau kebutuhan anak",
    icon: "baby",
    color: "#f59e0b",
  },
  {
    value: "tabungan_istri_melahirkan",
    label: "Tabungan Istri Melahirkan",
    description: "Persiapan biaya persalinan & kebutuhan ibu-bayi",
    icon: "heart-pulse",
    color: "#ec4899",
  },
  {
    value: "tabungan_beli_rumah",
    label: "Tabungan Beli Rumah",
    description: "DP rumah, renovasi, atau biaya KPR",
    icon: "home",
    color: "#6366f1",
  },
  {
    value: "tabungan_lainnya",
    label: "Tabungan Lainnya",
    description: "Target tabungan lain sesuai kebutuhan kamu",
    icon: "piggy-bank",
    color: "#06b6d4",
  },
]
