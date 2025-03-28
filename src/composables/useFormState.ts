import { reactive, computed } from "vue"
import type { FormGroup, FormValues } from "@/types/common"

// TODO: move to store
export const useFormState = (initialForms: FormGroup[]) => {
  const forms = reactive(initialForms)
  const formValues = reactive<FormValues>({})

  const resetForm = () => {
    Object.assign(formValues, initializeFormValues())
  }

  const updateFormValue = (key: string, value: any) => {
    formValues[key] = value
  }

  const initializeFormValues = () => {
    return forms.reduce((values, form) => {
      form.items.forEach((item) => {
        values[item.key] = null // Default to null for better form handling
      })
      return values
    }, {} as FormValues)
  }

  // Initialize form values on creation
  resetForm()

  return {
    forms: computed(() => forms),
    formValues,
    resetForm,
    updateFormValue,
  }
}
