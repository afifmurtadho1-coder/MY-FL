import { z } from "zod"

import { parseRupiahInput } from "@/lib/utils"

export const expenseFormSchema = z.object({
  amount: z
    .string()
    .min(1, "Nominal wajib diisi")
    .refine((value) => parseRupiahInput(value) > 0, "Nominal harus lebih dari 0")
    .refine(
      (value) => parseRupiahInput(value) <= 999_999_999_999,
      "Nominal terlalu besar",
    ),
  expense_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Tanggal tidak valid"),
  category_id: z.string().min(1, "Pilih kategori dulu"),
  payment_method_id: z.string().min(1, "Pilih platform pembayaran"),
  note: z.string().max(500, "Catatan maksimal 500 karakter"),
})

export type ExpenseFormValues = z.infer<typeof expenseFormSchema>
