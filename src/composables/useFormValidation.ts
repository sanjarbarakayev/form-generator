import { computed } from "vue"
import useVuelidate from "@vuelidate/core"
import type { FormGroup, FormValues } from "@/types/common"
import { parseValidationRules } from "@/utils/validation"
import type { ValidatedFormItem } from "@/types/validation"

// TODO: apply validation logic
export const useFormValidation = (
  forms: FormGroup[],
  formValues: FormValues
) => {
  // Create validation rules dynamically from JSON
  const validationRules = computed(() => {
    const rules: Record<string, Record<string, any>> = {}

    forms.forEach((form) => {
      form.items.forEach((formItem) => {
        // Type assertion to use extended interface
        const validatedItem = formItem as ValidatedFormItem
        rules[formItem.key] = parseValidationRules(validatedItem)
      })
    })

    return rules
  })

  // Create Vuelidate instance
  const v$ = useVuelidate(validationRules, formValues)

  // Submit handler
  const submitForm = async () => {
    const isFormValid = await v$.value.$validate()

    if (isFormValid) {
      console.log("Form submitted", formValues)
      return true
    } else {
      console.log("Form validation failed", v$.value.$errors)
      return false
    }
  }

  // Helper to get errors for a specific field
  const getFieldErrors = (key: string) => {
    return v$.value[key]?.$errors.map((error: any) => error.$message) || []
  }

  return {
    v$,
    submitForm,
    getFieldErrors,
  }
}
