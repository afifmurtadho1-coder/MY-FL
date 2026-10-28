export type CategoryBudget = {
  id: string
  user_id: string
  category_id: string
  month: string
  amount: number
  category_name?: string | null
  category_icon?: string | null
  category_color?: string | null
}

export type CategoryBudgetWithSpent = CategoryBudget & {
  spent: number
  percentage: number | null
  remaining: number
  status: "safe" | "warn" | "over"
}
