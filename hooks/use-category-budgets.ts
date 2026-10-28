import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  deleteCategoryBudget,
  fetchCategoryBudgets,
  upsertCategoryBudget,
} from "@/lib/data/category-budgets"

export function useCategoryBudgets(monthKey: string | null) {
  return useQuery({
    queryKey: ["category-budgets", monthKey],
    queryFn: () => fetchCategoryBudgets(monthKey as string),
    enabled: Boolean(monthKey),
    staleTime: 60_000,
  })
}

export function useUpsertCategoryBudget() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      categoryId,
      monthKey,
      amount,
    }: {
      categoryId: string
      monthKey: string
      amount: number
    }) => upsertCategoryBudget(categoryId, monthKey, amount),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["category-budgets", variables.monthKey] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
    },
  })
}

export function useDeleteCategoryBudget() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteCategoryBudget(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category-budgets"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
    },
  })
}
