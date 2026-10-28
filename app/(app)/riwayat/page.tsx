import type { Metadata } from "next"

import { HistoryView } from "@/components/expenses/history-view"

export const metadata: Metadata = {
  title: "Riwayat",
}

export default function RiwayatPage() {
  return <HistoryView />
}
