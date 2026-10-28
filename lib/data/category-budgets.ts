import { createClient } from "@/lib/supabase/client"
import { startOfMonthKey } from "@/lib/reports-date"
import type { CategoryBudget, CategoryBudgetWithSpent } from "@/types/budget"

async function callRpc<T>(
  name: string,
  args?: Record<string, unknown>,
): Promise<T> {
  const supabase = createClient()
  const { data, error } = await supabase.rpc(name, args)

  if (error) {
    throw new Error(error.message)
  }

  return data as T
}

export async function fetchCategoryBudgets(monthKey: string): Promise<CategoryBudgetWithSpent[]> {
  const supabase = createClient()
  const monthStart = startOfMonthKey(monthKey)

  const [budgetsRes, categoriesRes, expensesRes] = await Promise.all([
    supabase
      .from("budgets")
      .select("id, user_id, category_id, month, amount")
      .eq("month", monthStart),
    supabase.from("categories").select("id, name, icon, color"),
    supabase
      .from("expenses")
      .select("category_id, amount")
      .gte("expense_date", monthStart)
      .lte(
        "expense_date",
        (() => {
          const d = new Date(monthStart + "T00:00:00+07:00")
          d.setMonth(d.getMonth() + 1)
          d.setDate(0)
          return d.toISOString().slice(0, 10)
        })(),
      ),
  ])

  if (budgetsRes.error) throw new Error(budgetsRes.error.message)
  if (categoriesRes.error) throw new Error(categoriesRes.error.message)
  if (expensesRes.error) throw new Error(expensesRes.error.message)

  const categories = new Map(
    (categoriesRes.data ?? []).map((c) => [c.id, c]),
  )
  const spentMap = new Map<string, number>()
  for (const e of expensesRes.data ?? []) {
    if (!e.category_id) continue
    spentMap.set(e.category_id, (spentMap.get(e.category_id) ?? 0) + Number(e.amount))
  }

  const result: CategoryBudgetWithSpent[] = []
  for (const b of budgetsRes.data ?? []) {
    const cat = categories.get(b.category_id)
    const spent = spentMap.get(b.category_id) ?? 0
    const amount = Number(b.amount ?? 0)
    const percentage = amount > 0 ? (spent / amount) * 100 : null
    let status: "safe" | "warn" | "over" = "safe"
    if (percentage !== null) {
      if (percentage > 100) status = "over"
      else if (percentage >= 70) status = "warn"
    }
    result.push({
      ...(b as CategoryBudget),
      amount,
      category_name: cat?.name ?? null,
      category_icon: cat?.icon ?? null,
      category_color: cat?.color ?? null,
      spent,
      percentage,
      remaining: amount - spent,
      status,
    })
  }

  result.sort((a, b) => (b.spent - a.spent))
  return result
}

export async function upsertCategoryBudget(
  categoryId: string,
  monthKey: string,
  amount: number,
): Promise<void> {
  const supabase = createClient()
  const monthStart = startOfMonthKey(monthKey)
  const { error } = await supabase.from("budgets").upsert(
    {
      category_id: categoryId,
      month: monthStart,
      amount,
    },
    { onConflict: "user_id,category_id,month" },
  )
  if (error) throw new Error(error.message)
}

export async function deleteCategoryBudget(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from("budgets").delete().eq("id", id)
  if (error) throw new Error(error.message)
}
