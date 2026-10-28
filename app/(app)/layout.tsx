import type { ReactNode } from "react"

import { ExpenseSheetProvider } from "@/components/expenses/expense-sheet-provider"
import { AppShell } from "@/components/layout/app-shell"

export const dynamic = "force-dynamic"

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <ExpenseSheetProvider>
      <AppShell>{children}</AppShell>
    </ExpenseSheetProvider>
  )
}
