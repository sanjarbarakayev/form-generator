import type { FormGroup, FormItem } from "@/types/common"
import { ref, type Ref } from "vue"

export const useDragController = (forms: Ref<FormGroup[]>) => {
  const dragginEl = ref<FormItem | null>(null)

  // Drag and drop
  const handleDragStart = (item: FormItem) => {
    dragginEl.value = item
  }

  const handleDragEnd = () => {
    dragginEl.value = null
  }

  const handleDrop = (formId: number) => {
    const form = forms.value.find((form) => form.id === formId)
    if (!form) return

    form.items.push(dragginEl.value!)
    dragginEl.value = null
  }

  return {
    dragginEl,
    handleDragStart,
    handleDragEnd,
    handleDrop,
  }
}
