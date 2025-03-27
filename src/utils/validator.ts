export const validators = {
  required: (value: any) => {
    if (value === undefined || value === null || value === "") {
      return "This field is required"
    }
    return ""
  },

  minLength: (value: string, min: number) => {
    if (!value || value.length < min) {
      return `Minimum length is ${min} characters`
    }
    return ""
  },

  maxLength: (value: string, max: number) => {
    if (value && value.length > max) {
      return `Maximum length is ${max} characters`
    }
    return ""
  },

  email: (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      return "Invalid email address"
    }
    return ""
  },

  numeric: (value: string) => {
    const numericRegex = /^[0-9]+$/
    if (!numericRegex.test(value)) {
      return "Must contain only numbers"
    }
    return ""
  },

  alpha: (value: string) => {
    const alphaRegex = /^[A-Za-z]+$/
    if (!alphaRegex.test(value)) {
      return "Must contain only letters"
    }
    return ""
  },

  alphaNumeric: (value: string) => {
    const alphaNumericRegex = /^[A-Za-z0-9]+$/
    if (!alphaNumericRegex.test(value)) {
      return "Must contain only letters and numbers"
    }
    return ""
  },
}
