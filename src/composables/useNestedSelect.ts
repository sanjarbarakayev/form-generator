import { ref } from "vue"
import type { FormItem } from "@/types/form"

// TODO: apply refactored nested select controller
export const useNestedSelect = () => {
  const subOptions = ref()

  const handleNestedSelection = (
    formItem: FormItem,
    formValues: Record<string, any>
  ) => {
    if (formItem.options) {
      const selectedOptionId = formValues[formItem.key]
      const selectedOption = formItem.options.find(
        (option) => option.id === selectedOptionId
      )

      // Update values
      formValues[formItem.key] = selectedOption?.id
      subOptions.value = selectedOption?.options

      // Reset child field
      if (formItem.childKey) {
        formValues[formItem.childKey] = undefined
      }
    }

    return subOptions.value
  }

  return {
    subOptions,
    handleNestedSelection,
  }
}
