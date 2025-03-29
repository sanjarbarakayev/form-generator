import type { FormItemType } from "@/types/form"

/**
 * Converts a number of columns into a Tailwind CSS grid class
 * @param cols The number of columns (1-12)
 * @returns The corresponding Tailwind grid class
 */
export const getColumnClass = (cols: number) => {
  // Define a mapping of column numbers to Tailwind grid classes
  // This follows the 12-column grid system used in Tailwind CSS
  // If you try to define grid styles like this: `grid-cols-${cols}`
  // It will not work as expected because Tailwind CSS can handle
  // dynamic values only at build time, not at runtime

  const columnClasses = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
    7: "grid-cols-7",
    8: "grid-cols-8",
    9: "grid-cols-9",
    10: "grid-cols-10",
    11: "grid-cols-11",
    12: "grid-cols-12",
  }

  // Return the corresponding grid class for the given number of columns
  // If the number is not in the range 1-12, default to 'grid-cols-1'
  return columnClasses[cols as keyof typeof columnClasses] || "grid-cols-1"
}

/**
 * Generates a unique ID for a form item
 * @param type The type of the form item
 * @returns A unique ID
 */
export const generateId = (type: FormItemType) => {
  // Generate a random number between 0 and 1000000
  const randomNumber = Math.floor(Math.random() * 1000000)

  return `${type}-${randomNumber}`
}
