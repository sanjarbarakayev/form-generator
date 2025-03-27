import {
  required,
  email,
  minLength,
  maxLength,
  numeric,
  alpha,
  sameAs,
} from "@vuelidate/validators"
import type { FormItem } from "./common"

// Mapping of validation rule names to Vuelidate validators
export const validatorMap = {
  required: () => required,
  email: () => email,
  minLength: (value: number) => minLength(value),
  maxLength: (value: number) => maxLength(value),
  numeric: () => numeric,
  alpha: () => alpha,
  sameAs: (value: string) => sameAs(value),
}

// Extended FormItem interface to include validation
export interface ValidatedFormItem extends FormItem {
    validators?: {
    type: keyof typeof validatorMap
    value?: number | string
    message?: string
  }[]
}
