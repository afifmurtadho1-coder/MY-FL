import type { Metadata } from "next"
import { BudgetSettingsView } from "@/components/settings/budget-settings-view"

export const metadata: Metadata = {
  title: "Budget per Kategori",
}

export default function BudgetPage() {
  return <BudgetSettingsView />
}
