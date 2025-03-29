import type { FormItem } from "./form"
import type { validatorMap } from "@/utils/validation"

// Extended FormItem interface to include validation rules
export interface ValidatedFormItem extends FormItem {
  validators?: {
    type: keyof typeof validatorMap
    value?: number | string
    message?: string
  }[]
}
