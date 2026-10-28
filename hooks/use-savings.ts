import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  addSavingTransaction,
  createSaving,
  deleteSaving,
  fetchSavingDetail,
  fetchSavings,
  updateSaving,
} from "@/lib/data/savings"
import type { SavingCategory, SavingStatus } from "@/types/savings"

export function useSavings() {
  return useQuery({
    queryKey: ["savings"],
    queryFn: fetchSavings,
    staleTime: 60_000,
  })
}

export function useSavingDetail(savingId: string | null) {
  return useQuery({
    queryKey: ["savings", savingId],
    queryFn: () => fetchSavingDetail(savingId as string),
    enabled: Boolean(savingId),
  })
}

export function useCreateSaving() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: {
      name: string
      category: SavingCategory
      target_amount: number
      start_date?: string
      target_date?: string | null
      note?: string | null
      color?: string | null
      icon?: string | null
    }) => createSaving(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savings"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
      queryClient.invalidateQueries({ queryKey: ["reports"] })
    },
  })
}

export function useUpdateSaving() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string
      input: Partial<{
        name: string
        target_amount: number
        target_date: string | null
        status: SavingStatus
        note: string | null
        color: string | null
        icon: string | null
      }>
    }) => updateSaving(id, input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["savings"] })
      queryClient.invalidateQueries({ queryKey: ["savings", variables.id] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
      queryClient.invalidateQueries({ queryKey: ["reports"] })
    },
  })
}

export function useDeleteSaving() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteSaving(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savings"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
      queryClient.invalidateQueries({ queryKey: ["reports"] })
    },
  })
}

export function useAddSavingTransaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: {
      saving_id: string
      amount: number
      type: "deposit" | "withdraw"
      transaction_date?: string
      note?: string | null
    }) => addSavingTransaction(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["savings"] })
      queryClient.invalidateQueries({ queryKey: ["savings", variables.saving_id] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
      queryClient.invalidateQueries({ queryKey: ["reports"] })
    },
  })
}
