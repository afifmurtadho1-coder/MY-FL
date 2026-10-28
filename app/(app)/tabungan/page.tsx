import type { Metadata } from "next"

import { SavingsView } from "@/components/savings/savings-view"

export const metadata: Metadata = {
  title: "Tabungan",
}

export default function TabunganPage() {
  return <SavingsView />
}
