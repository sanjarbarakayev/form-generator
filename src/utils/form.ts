import type { FormValues } from "@/types/form"

/**
 * Sanitize form values (remove undefined or null)
 * @param formValues Current form values
 * @returns Cleaned form values
 */
export const sanitizeFormValues = (formValues: FormValues): FormValues => {
  return Object.fromEntries(
    Object.entries(formValues).filter(
      ([_, value]) => value !== undefined && value !== null
    )
  )
}

/**
 * Generate form data transfer object
 * @param formValues Current form values
 * @returns Transformed form data
 */
export const createFormDTO = (formValues: FormValues) => {
  const sanitizedValues = sanitizeFormValues(formValues)

  return {
    data: sanitizedValues,
    timestamp: new Date().toISOString(),
  }
}
