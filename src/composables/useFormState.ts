import { reactive, ref } from "vue"
import type { FormGroup, FormValues } from "@/types/common"

export const useFormState = (initialForms: FormGroup[]) => {
  const forms = ref(initialForms)
  const formValues = reactive<FormValues>({})

  const resetForm = () => {
    Object.keys(formValues).forEach((key) => {
      delete formValues[key]
    })
  }

  const updateFormValue = (key: string, value: any) => {
    formValues[key] = value
  }

  const initializeFormValues = () => {
    forms.value.forEach((form) => {
      form.items.forEach((item) => {
        // Initialize with undefined as a default value
        formValues[item.key] = undefined
      })
    })
  }

  // Initialize form values on creation
  initializeFormValues()

  return {
    forms,
    formValues,
    resetForm,
    updateFormValue,
  }
}
