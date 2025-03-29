import type { validatorMap } from "@/utils/validation"

interface Option {
  id: number | string
  label: string
  options?: Option[]
}

export interface FormItem {
  id: number | string
  type: string
  name: string
  key: string
  label: string
  placeholder?: string
  hasChild?: boolean
  childKey?: string
  childLabel?: string
  childName?: string
  childPlaceholder?: string
  layout?: "row" | "column"
  options?: Option[]
  rows?: number
  inline?: boolean
  variant?: string
  editControllerAvailable?: boolean
  validators?: {
    type: keyof typeof validatorMap
    value?: number | string
    message?: string
  }[]
}

export interface FormGroup {
  id: number
  cols: number
  name: string
  items: FormItem[]
}

export type FormValues = Record<FormItem["key"], any>

export interface FormState {
  values: Record<string, any>
  errors: Record<string, string[]>
  touched: Record<string, boolean>
}
