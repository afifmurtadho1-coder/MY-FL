import { createClient } from "@/lib/supabase/client"
import type { Saving, SavingCategory, SavingTransaction } from "@/types/savings"

export async function fetchSavings(): Promise<Saving[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("savings")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) throw error
  return (data ?? []) as Saving[]
}

export async function fetchSavingDetail(
  savingId: string,
): Promise<{ saving: Saving; transactions: SavingTransaction[] }> {
  const supabase = createClient()
  const [savingRes, txRes] = await Promise.all([
    supabase.from("savings").select("*").eq("id", savingId).single(),
    supabase
      .from("saving_transactions")
      .select("*")
      .eq("saving_id", savingId)
      .order("transaction_date", { ascending: false })
      .order("created_at", { ascending: false }),
  ])

  if (savingRes.error) throw savingRes.error
  if (txRes.error) throw txRes.error

  return {
    saving: savingRes.data as Saving,
    transactions: (txRes.data ?? []) as SavingTransaction[],
  }
}

export async function createSaving(input: {
  name: string
  category: SavingCategory
  target_amount: number
  start_date?: string
  target_date?: string | null
  note?: string | null
  color?: string | null
  icon?: string | null
}) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Tidak terautentikasi")

  const { data, error } = await supabase
    .from("savings")
    .insert({
      user_id: user.id,
      name: input.name,
      category: input.category,
      target_amount: input.target_amount,
      current_amount: 0,
      start_date: input.start_date ?? new Date().toISOString().slice(0, 10),
      target_date: input.target_date ?? null,
      status: "berjalan",
      note: input.note ?? null,
      color: input.color ?? null,
      icon: input.icon ?? null,
    })
    .select("*")
    .single()

  if (error) throw error
  return data as Saving
}

export async function updateSaving(
  id: string,
  input: Partial<{
    name: string
    target_amount: number
    target_date: string | null
    status: "berjalan" | "tercapai" | "berhenti"
    note: string | null
    color: string | null
    icon: string | null
  }>,
) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("savings")
    .update(input)
    .eq("id", id)
    .select("*")
    .single()

  if (error) throw error
  return data as Saving
}

export async function deleteSaving(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from("savings").delete().eq("id", id)
  if (error) throw error
}

export async function addSavingTransaction(input: {
  saving_id: string
  amount: number
  type: "deposit" | "withdraw"
  transaction_date?: string
  note?: string | null
}) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Tidak terautentikasi")

  const { data, error } = await supabase
    .from("saving_transactions")
    .insert({
      user_id: user.id,
      saving_id: input.saving_id,
      amount: input.amount,
      type: input.type,
      transaction_date: input.transaction_date ?? new Date().toISOString().slice(0, 10),
      note: input.note ?? null,
    })
    .select("*")
    .single()

  if (error) throw error
  return data as SavingTransaction
}
