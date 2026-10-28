"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { AlertCircle, Check, Loader2 } from "lucide-react"
import { useState } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"

import { AppIcon } from "@/components/expenses/app-icon"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import {
  useCategories,
  useCreateExpense,
  usePaymentMethods,
  useUpdateExpense,
} from "@/hooks/use-finance"
import { getReadErrorMessage, getWriteErrorMessage } from "@/lib/errors"
import {
  formatRupiahInput,
  getContrastText,
  getTodayInJakarta,
  parseRupiahInput,
} from "@/lib/utils"
import { expenseFormSchema, type ExpenseFormValues } from "@/lib/validation/expense"
import type { Expense } from "@/types/finance"

type ExpenseFormProps = {
  expense?: Expense | null
  onSaved: () => void
  onCancel: () => void
}

export function ExpenseForm({ expense, onSaved, onCancel }: ExpenseFormProps) {
  const categoriesQuery = useCategories()
  const paymentMethodsQuery = usePaymentMethods()
  const createMutation = useCreateExpense()
  const updateMutation = useUpdateExpense()
  const [formError, setFormError] = useState("")
  const isEditing = Boolean(expense)

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      amount: expense ? formatRupiahInput(expense.amount) : "",
      expense_date: expense?.expense_date ?? getTodayInJakarta(),
      category_id: expense?.category_id ?? "",
      payment_method_id: expense?.payment_method_id ?? "",
      note: expense?.note ?? "",
    },
  })

  const categoryId = useWatch({ control, name: "category_id" })
  const categories = categoriesQuery.data ?? []
  const paymentMethods = paymentMethodsQuery.data ?? []
  const selectedCategory = categories.find(
    (category) => category.id === categoryId,
  )
  const isSaving = createMutation.isPending || updateMutation.isPending

  async function onSubmit(values: ExpenseFormValues) {
    setFormError("")
    createMutation.reset()
    updateMutation.reset()

    const input = {
      amount: parseRupiahInput(values.amount),
      expense_date: values.expense_date,
      category_id: values.category_id,
      payment_method_id: values.payment_method_id,
      note: values.note.trim() || null,
    }

    try {
      if (expense) {
        await updateMutation.mutateAsync({ id: expense.id, input })
        toast.success("Perubahan disimpan", {
          description: "Transaksi berhasil diperbarui.",
        })
      } else {
        await createMutation.mutateAsync(input)
        toast.success("Pengeluaran tersimpan", {
          description: "Transaksi baru sudah masuk ke riwayat.",
        })
      }

      onSaved()
    } catch (error) {
      const message = getWriteErrorMessage(error)
      setFormError(message)
      toast.error(isEditing ? "Gagal menyimpan perubahan" : "Gagal menyimpan", {
        description: message,
      })
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex min-h-0 flex-1 flex-col"
      noValidate
    >
      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 pb-5">
        <div className="space-y-2">
          <Label htmlFor="expense-amount">Nominal</Label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-sm font-medium text-muted-foreground">
              Rp
            </span>
            <Controller
              control={control}
              name="amount"
              render={({ field }) => (
                <Input
                  id="expense-amount"
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder="0"
                  value={field.value}
                  onChange={(event) =>
                    field.onChange(formatRupiahInput(event.target.value))
                  }
                  onBlur={field.onBlur}
                  ref={field.ref}
                  aria-invalid={Boolean(errors.amount)}
                  className="h-12 rounded-xl bg-background/60 pl-10 text-lg font-semibold tracking-tight"
                />
              )}
            />
          </div>
          {errors.amount && (
            <p className="text-xs text-destructive">{errors.amount.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="expense-date">Tanggal</Label>
          <Input
            id="expense-date"
            type="date"
            aria-invalid={Boolean(errors.expense_date)}
            className="h-11 rounded-xl bg-background/60"
            {...register("expense_date")}
          />
          {errors.expense_date && (
            <p className="text-xs text-destructive">
              {errors.expense_date.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <Label>Kategori</Label>
            {selectedCategory && (
              <span className="text-[11px] text-muted-foreground">
                Dipilih: {selectedCategory.name}
              </span>
            )}
          </div>

          {categoriesQuery.isLoading && (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-[72px] rounded-xl" />
              ))}
            </div>
          )}

          {categoriesQuery.isError && (
            <div className="flex items-center justify-between gap-3 rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-2.5">
              <p className="flex items-center gap-2 text-xs text-destructive">
                <AlertCircle className="size-4 shrink-0" />
                {getReadErrorMessage(categoriesQuery.error)}
              </p>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => categoriesQuery.refetch()}
                disabled={categoriesQuery.isFetching}
              >
                Coba lagi
              </Button>
            </div>
          )}

          {!categoriesQuery.isLoading &&
            !categoriesQuery.isError &&
            categories.length === 0 && (
              <p className="rounded-xl border border-dashed border-border/80 bg-muted/20 px-3 py-4 text-center text-xs text-muted-foreground">
                Belum ada kategori tersedia.
              </p>
            )}

          {categories.length > 0 && (
            <Controller
              control={control}
              name="category_id"
              render={({ field }) => (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {categories.map((category) => {
                    const selected = field.value === category.id
                    const color = category.color ?? "#6B7280"

                    return (
                      <button
                        key={category.id}
                        type="button"
                        title={category.description ?? category.name}
                        aria-pressed={selected}
                        onClick={() => field.onChange(category.id)}
                        className={`flex min-h-[72px] flex-col items-start gap-2 rounded-xl border-2 p-2.5 text-left transition ${
                          selected
                            ? "bg-muted/60"
                            : "border-border/50 bg-background/40 hover:bg-muted/40"
                        }`}
                        style={
                          selected
                            ? {
                                borderColor: color,
                                backgroundColor: `${color}12`,
                              }
                            : undefined
                        }
                      >
                        <span
                          className="flex size-8 items-center justify-center rounded-lg"
                          style={{
                            backgroundColor: `${color}1f`,
                            color,
                          }}
                        >
                          <AppIcon name={category.icon} className="size-4" />
                        </span>
                        <span className="line-clamp-2 text-[11px] font-medium leading-tight">
                          {category.name}
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}
            />
          )}

          <p className="min-h-4 text-[11px] leading-relaxed text-muted-foreground">
            {selectedCategory?.description ??
              "Sentuh ikon untuk memilih kategori. Deskripsi kategori tampil di sini."}
          </p>
          {errors.category_id && (
            <p className="text-xs text-destructive">
              {errors.category_id.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Platform</Label>

          {paymentMethodsQuery.isLoading && (
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-8 w-20 rounded-full" />
              ))}
            </div>
          )}

          {paymentMethodsQuery.isError && (
            <div className="flex items-center justify-between gap-3 rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-2.5">
              <p className="flex items-center gap-2 text-xs text-destructive">
                <AlertCircle className="size-4 shrink-0" />
                {getReadErrorMessage(paymentMethodsQuery.error)}
              </p>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => paymentMethodsQuery.refetch()}
                disabled={paymentMethodsQuery.isFetching}
              >
                Coba lagi
              </Button>
            </div>
          )}

          {!paymentMethodsQuery.isLoading &&
            !paymentMethodsQuery.isError &&
            paymentMethods.length === 0 && (
              <p className="rounded-xl border border-dashed border-border/80 bg-muted/20 px-3 py-4 text-center text-xs text-muted-foreground">
                Belum ada platform pembayaran tersedia.
              </p>
            )}

          {paymentMethods.length > 0 && (
            <Controller
              control={control}
              name="payment_method_id"
              render={({ field }) => (
                <div className="flex flex-wrap gap-2">
                  {paymentMethods.map((method) => {
                    const selected = field.value === method.id
                    const color = method.color ?? "#6B7280"

                    return (
                      <button
                        key={method.id}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => field.onChange(method.id)}
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                          selected
                            ? "border-transparent shadow-sm"
                            : "border-border/70 bg-background/40 hover:bg-muted/40"
                        }`}
                        style={
                          selected
                            ? {
                                backgroundColor: color,
                                color: getContrastText(color),
                              }
                            : { color }
                        }
                      >
                        {selected ? (
                          <Check className="size-3.5" />
                        ) : (
                          <AppIcon name={method.icon} className="size-3.5" />
                        )}
                        {method.name}
                      </button>
                    )
                  })}
                </div>
              )}
            />
          )}

          {errors.payment_method_id && (
            <p className="text-xs text-destructive">
              {errors.payment_method_id.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="expense-note">Catatan</Label>
            <span className="text-[11px] text-muted-foreground">Opsional</span>
          </div>
          <Textarea
            id="expense-note"
            rows={3}
            placeholder="Contoh: makan siang bareng tim"
            aria-invalid={Boolean(errors.note)}
            className="min-h-20 rounded-xl bg-background/60"
            {...register("note")}
          />
          {errors.note && (
            <p className="text-xs text-destructive">{errors.note.message}</p>
          )}
        </div>

        {formError && (
          <p
            role="alert"
            className="rounded-xl border border-destructive/20 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive"
          >
            {formError}
          </p>
        )}
      </div>

      <div className="flex gap-2 border-t border-border/60 bg-popover/95 p-4 backdrop-blur">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSaving}
          className="h-11 flex-1 rounded-xl"
        >
          Batal
        </Button>
        <Button
          type="submit"
          disabled={isSaving}
          className="h-11 flex-[1.4] rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-600 hover:to-violet-700"
        >
          {isSaving ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Check className="size-4" />
          )}
          {isSaving
            ? "Menyimpan..."
            : isEditing
              ? "Simpan perubahan"
              : "Simpan pengeluaran"}
        </Button>
      </div>
    </form>
  )
}
