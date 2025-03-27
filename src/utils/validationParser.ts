import { validatorMap, type ValidatedFormItem } from "@/types/validation"

export const parseValidationRules = (formItem: ValidatedFormItem) => {
  if (!formItem.validators) {
    return {}
  }

  const rules: Record<string, any> = {}

  formItem.validators?.forEach((rule) => {
    const validatorFactory = validatorMap[rule.type]

    if (validatorFactory) {
      // If the validator requires a value (like minLength), pass it
      const validator =
        rule.value !== undefined
          ? validatorFactory(rule.value)
          : validatorFactory()

      // Add the validator with a custom error message if provided
      rules[rule.type] = {
        $validator: validator,
        $message: rule.message || `Validation failed for ${rule.type}`,
      }
    }
  })

  return rules
}
