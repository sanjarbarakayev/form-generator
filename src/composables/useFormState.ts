import { reactive } from "vue"
import type { FormGroup, FormValues } from "@/types/form"
import { ref } from "vue"

// TODO: move to store
export const useFormState = (initialForms: FormGroup[]) => {
  const forms = ref(initialForms)
  const formValues = reactive<FormValues>({})

  const resetForm = () => {
    Object.assign(formValues, initializeFormValues())
  }

  const updateFormValue = (key: string, value: any) => {
    formValues[key] = value
  }

  const initializeFormValues = () => {
    return forms.value.reduce((values, form) => {
      form.items.forEach((item) => {
        values[item.key] = undefined
      })
      return values
    }, {} as FormValues)
  }

  // Initialize form values on creation
  resetForm()

  return {
    forms,
    formValues,
    resetForm,
    updateFormValue,
  }
}
