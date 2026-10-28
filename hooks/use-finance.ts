import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  createExpense,
  deleteExpense,
  fetchCategories,
  fetchExpenses,
  fetchPaymentMethods,
  updateExpense,
} from "@/lib/data/finance"
import type { ExpenseFilters, ExpenseInput } from "@/types/finance"

const financeKeys = {
  categories: ["categories"] as const,
  paymentMethods: ["payment-methods"] as const,
  expenses: (filters: ExpenseFilters) =>
    [
      "expenses",
      filters.categoryId,
      filters.paymentMethodId,
      filters.dateFrom,
      filters.dateTo,
      filters.search,
    ] as const,
}

export function useCategories() {
  return useQuery({
    queryKey: financeKeys.categories,
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 60,
  })
}

export function usePaymentMethods() {
  return useQuery({
    queryKey: financeKeys.paymentMethods,
    queryFn: fetchPaymentMethods,
    staleTime: 1000 * 60 * 60,
  })
}

export function useExpenses(filters: ExpenseFilters) {
  return useQuery({
    queryKey: financeKeys.expenses(filters),
    queryFn: () => fetchExpenses(filters),
    placeholderData: (previous) => previous,
  })
}

export function useCreateExpense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: ExpenseInput) => createExpense(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
      queryClient.invalidateQueries({ queryKey: ["reports"] })
      queryClient.invalidateQueries({ queryKey: ["category-budgets"] })
    },
  })
}

export function useUpdateExpense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: ExpenseInput }) =>
      updateExpense(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
      queryClient.invalidateQueries({ queryKey: ["reports"] })
      queryClient.invalidateQueries({ queryKey: ["category-budgets"] })
    },
  })
}

export function useDeleteExpense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteExpense(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
      queryClient.invalidateQueries({ queryKey: ["reports"] })
      queryClient.invalidateQueries({ queryKey: ["category-budgets"] })
    },
  })
}
