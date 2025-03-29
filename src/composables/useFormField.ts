// useFormField.ts
import { computed, ref, unref } from "vue"
import type { FormItem, FormValues } from "@/types/form"
import type { Option } from "element-plus/es/components/select-v2/src/select.types"

export function useFormField(
  formItem: FormItem,
  formValues: FormValues,
  validation: Record<string, any>
) {
  // Unref form values to get reactive values
  const values = unref(formValues)

  // Reactive sub options for parent-child select relationship
  const subOptions = ref<Option[]>([])

  // Maps form field types to component types
  const getComponentType = (type: string): string => {
    const componentMap: Record<string, string> = {
      input: "ElInput",
      textarea: "ElInput",
      checkbox: "ElCheckbox",
      checkboxGroup: "ElCheckboxGroup",
      radio: "ElRadio",
      radioGroup: "ElRadioGroup",
      date: "ElDatePicker",
    }

    return componentMap[type] || "div"
  }

  // Checks if a form type has options (checkbox, radio, select)
  const hasOptions = (type: string): boolean => {
    return ["select", "checkboxGroup", "radioGroup"].includes(type)
  }

  // Returns the appropriate option component based on the field type
  const getOptionComponent = (type: string): string => {
    const optionMap: Record<string, string> = {
      select: "ElOption",
      checkboxGroup: "ElCheckbox",
      radioGroup: "ElRadio",
    }

    return optionMap[type] || ""
  }

  // Checks if a form type requires special handling outside of dynamic components
  const isComplexType = (type: string): boolean => {
    return ["select"].includes(type)
  }

  // Generates appropriate props for each component type
  const getComponentProps = (formItem: FormItem): Record<string, any> => {
    const commonProps = {
      placeholder: formItem.placeholder,
      key: formItem.key,
    }

    const typeSpecificProps: Record<string, Record<string, any>> = {
      input: {
        type: formItem.variant || "text",
      },
      textarea: {
        type: "textarea",
        rows: formItem.rows || 3,
      },
      date: {},
      checkbox: {
        label: formItem.selectionLabel,
      },
      radio: {
        label: formItem.selectionLabel,
      },
    }

    return { ...commonProps, ...(typeSpecificProps[formItem.type] || {}) }
  }

  // Handles the selection of an option in a parent select field
  const onSelectOption = (formItem: FormItem) => {
    if (formItem.options) {
      // Get selected option
      const selectedOption = formItem.options.find(
        (option) => option.id === values[formItem.key]
      )

      // Update sub options
      subOptions.value = selectedOption?.options || []

      // Reset child field value when parent option changes
      if (formItem.childKey) {
        values[formItem.childKey] = undefined
      }
    }
  }

  // Validation related functions
  const fieldHasErrors = (key: string): boolean => {
    return Boolean(validation[key]?.$errors?.length)
  }

  // Gets the validation errors for a specific field
  const fieldErrors = computed(() => {
    const fieldValidation = validation[formItem.key]
    return fieldValidation?.$errors.map((error: any) => error.$message) || []
  })

  return {
    values,
    subOptions,
    getComponentType,
    hasOptions,
    getOptionComponent,
    isComplexType,
    getComponentProps,
    onSelectOption,
    fieldHasErrors,
    fieldErrors,
  }
}
