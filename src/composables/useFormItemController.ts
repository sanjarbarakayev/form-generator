import type { FormItem } from "@/types/common"
import { ref } from "vue"

export const useFormItemController = () => {
  const selectedFormItem = ref<FormItem | null>(null)

  const handleEdit = (formItem: FormItem) => {
    console.log("Edit form item", formItem)

    selectedFormItem.value = formItem
  }

  return {
    selectedFormItem,
    handleEdit,
  }
}
