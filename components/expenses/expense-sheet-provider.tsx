"use client"

import { createContext, useCallback, useContext, useMemo, useState } from "react"

import { ExpenseForm } from "@/components/expenses/expense-form"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import type { Expense } from "@/types/finance"

type ExpenseSheetContextValue = {
  openCreate: () => void
  openEdit: (expense: Expense) => void
}

const ExpenseSheetContext = createContext<ExpenseSheetContextValue | null>(null)

export function useExpenseSheet() {
  const context = useContext(ExpenseSheetContext)

  if (!context) {
    throw new Error("useExpenseSheet harus dipakai di dalam ExpenseSheetProvider")
  }

  return context
}

export function ExpenseSheetProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [expense, setExpense] = useState<Expense | null>(null)

  const openCreate = useCallback(() => {
    setExpense(null)
    setOpen(true)
  }, [])

  const openEdit = useCallback((value: Expense) => {
    setExpense(value)
    setOpen(true)
  }, [])

  const close = useCallback(() => {
    setOpen(false)
  }, [])

  const value = useMemo(
    () => ({ openCreate, openEdit }),
    [openCreate, openEdit],
  )

  return (
    <ExpenseSheetContext.Provider value={value}>
      {children}

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="bottom"
          className="max-h-[92dvh] gap-0 overflow-hidden rounded-t-3xl p-0 sm:mx-auto sm:max-w-2xl"
        >
          <div
            aria-hidden
            className="mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-full bg-muted-foreground/25"
          />
          <SheetHeader className="px-4 pb-3 pt-3">
            <SheetTitle>
              {expense ? "Edit pengeluaran" : "Tambah pengeluaran"}
            </SheetTitle>
            <SheetDescription>
              {expense
                ? "Perbarui detail transaksi lalu simpan."
                : "Isi seperlunya, nominal dan tanggal sudah siap."}
            </SheetDescription>
          </SheetHeader>

          <ExpenseForm
            key={expense?.id ?? "new"}
            expense={expense}
            onSaved={close}
            onCancel={close}
          />
        </SheetContent>
      </Sheet>
    </ExpenseSheetContext.Provider>
  )
}
