export type Category = {
  id: string
  name: string
  icon: string | null
  color: string | null
  description: string | null
  sort_order: number
}

export type PaymentMethod = {
  id: string
  name: string
  color: string | null
  icon: string | null
  sort_order: number
}

export type Expense = {
  id: string
  amount: number
  expense_date: string
  category_id: string | null
  payment_method_id: string | null
  note: string | null
  created_at: string
  updated_at: string
  category: Category | null
  payment_method: PaymentMethod | null
}

export type ExpenseFilters = {
  categoryId: string
  paymentMethodId: string
  dateFrom: string
  dateTo: string
  search: string
}

export type ExpenseInput = {
  amount: number
  expense_date: string
  category_id: string
  payment_method_id: string
  note: string | null
}
