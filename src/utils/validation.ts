import { type ValidatedFormItem } from "@/types/validation"
import {
  required,
  email,
  minLength,
  maxLength,
  numeric,
  alpha,
  sameAs,
} from "@vuelidate/validators"

/**
 * Mapping of validation rule names to Vuelidate validators
 * @example
 * ```ts
 * validatorMap["required"]()
 * ```
 */
export const validatorMap = {
  required: () => required,
  email: () => email,
  minLength: (value: number) => minLength(value),
  maxLength: (value: number) => maxLength(value),
  numeric: () => numeric,
  alpha: () => alpha,
  sameAs: (value: string) => sameAs(value),
}

/**
 * Parses validation rules from a form item
 * @param formItem The form item to parse
 * @returns An object containing validation rules
 */
export const parseValidationRules = (formItem: ValidatedFormItem) => {
  // If no validators are provided, return an empty object
  if (!formItem.validators) {
    return {}
  }

  // Initialize rules object to store validation rules
  const rules: Record<string, any> = {}

  // Iterate through each validation rule in the form item
  formItem.validators?.forEach((rule) => {
    // Get the validator factory function from the validator map
    const validatorFactory = validatorMap[rule.type]

    // If the validator exists in the map
    if (validatorFactory) {
      // Create the validator instance
      // If the rule has a value (like minLength: 5), pass it to the validator
      // Otherwise, create the validator without any value
      const validator =
        rule.value !== undefined
          ? validatorFactory(rule.value)
          : validatorFactory()

      // Add the validator to the rules object with:
      // - $validator: The actual validation function
      // - $message: Custom error message or default message
      rules[rule.type] = {
        $validator: validator,
        $message: rule.message || `Validation failed for ${rule.type}`,
      }
    }
  })

  // Return the parsed validation rules
  return rules
}
