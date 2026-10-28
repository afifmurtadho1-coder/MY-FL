import { createClient } from "@/lib/supabase/client"
import type {
  Category,
  Expense,
  ExpenseFilters,
  ExpenseInput,
  PaymentMethod,
} from "@/types/finance"

const EXPENSE_SELECT = `
  id,
  amount,
  expense_date,
  category_id,
  payment_method_id,
  note,
  created_at,
  updated_at,
  category:categories(id, name, icon, color, description, sort_order),
  payment_method:payment_methods(id, name, icon, color, sort_order)
`

type ExpenseRow = Omit<Expense, "amount" | "category" | "payment_method"> & {
  amount: number | string
  category: Category | Category[] | null
  payment_method: PaymentMethod | PaymentMethod[] | null
}

function firstRelation<T>(value: T | T[] | null) {
  return Array.isArray(value) ? (value[0] ?? null) : value
}

function normalizeExpense(row: ExpenseRow): Expense {
  return {
    ...row,
    amount: Number(row.amount),
    category: firstRelation(row.category),
    payment_method: firstRelation(row.payment_method),
  }
}

export async function fetchCategories() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, icon, color, description, sort_order")
    .order("sort_order", { ascending: true })

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []) as Category[]
}

export async function fetchPaymentMethods() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("payment_methods")
    .select("id, name, color, icon, sort_order")
    .order("sort_order", { ascending: true })

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []) as PaymentMethod[]
}

export async function fetchExpenses(filters: ExpenseFilters) {
  const supabase = createClient()
  let query = supabase
    .from("expenses")
    .select(EXPENSE_SELECT)
    .order("expense_date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(1000)

  if (filters.categoryId !== "all") {
    query = query.eq("category_id", filters.categoryId)
  }

  if (filters.paymentMethodId !== "all") {
    query = query.eq("payment_method_id", filters.paymentMethodId)
  }

  if (filters.dateFrom) {
    query = query.gte("expense_date", filters.dateFrom)
  }

  if (filters.dateTo) {
    query = query.lte("expense_date", filters.dateTo)
  }

  const search = filters.search.trim()

  if (search) {
    query = query.ilike("note", `%${search}%`)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(error.message)
  }

  return ((data ?? []) as unknown as ExpenseRow[]).map(normalizeExpense)
}

export async function createExpense(input: ExpenseInput) {
  const supabase = createClient()
  const { error } = await supabase.from("expenses").insert(input)

  if (error) {
    throw new Error(error.message)
  }
}

export async function updateExpense(id: string, input: ExpenseInput) {
  const supabase = createClient()
  const { error } = await supabase
    .from("expenses")
    .update(input)
    .eq("id", id)

  if (error) {
    throw new Error(error.message)
  }
}

export async function deleteExpense(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from("expenses").delete().eq("id", id)

  if (error) {
    throw new Error(error.message)
  }
}
