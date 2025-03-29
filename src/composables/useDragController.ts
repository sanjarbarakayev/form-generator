import type { FormGroup, FormItem } from "@/types/form"
import { generateId } from "@/utils/common"
import { ref, type Ref } from "vue"

export const useDragController = (forms: Ref<FormGroup[]>) => {
  const droppedEl = ref<FormItem | null>(null)

  // Drag and drop
  const handleDragStart = (item: FormItem) => {
    // Perform a shallow copy of the item to preserve immutability
    // This ensures that modifications do not affect the original reference
    // Using the original item would result in v-model bindings being shared across instances
    droppedEl.value = { ...item }
  }

  const handleDragEnd = () => {
    droppedEl.value = null
  }

  const handleDrop = (formId: number) => {
    console.log("handleDrop", formId)

    // Find the form item
    const form = forms.value.find((form) => form.id === formId)

    // If form item not found, return
    if (!form) return

    // Generate a new ID for the dragged element
    const newId = generateId(droppedEl.value!.type)
    droppedEl.value!.id = newId
    droppedEl.value!.key = newId

    // Add the dragged element to the form
    form.items.push(droppedEl.value!)
    console.log("form", form)

    // Reset the drag state
    droppedEl.value = null
  }

  return {
    droppedEl,
    handleDragStart,
    handleDragEnd,
    handleDrop,
  }
}
