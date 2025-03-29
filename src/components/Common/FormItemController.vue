<template>
  <section>
    <h2 class="text-lg font-semibold mb-2">Form element controller</h2>
    <ul v-if="formItem" class="flex flex-col gap-4">
      <!-- General controllers -->
      <!-- Label controller -->
      <li>
        <label for="label">Label</label>
        <ElInput v-model="formItem.label" placeholder="Enter label" />
      </li>
      <!-- Placeholder controller -->
      <li>
        <label for="placeholder">Placeholder</label>
        <ElInput
          v-model="formItem.placeholder"
          placeholder="Enter placeholder"
        />
      </li>

      <!-- Checkbox controllers -->
    </ul>
  </section>
</template>

<script setup lang="ts">
import type { FormItem } from "@/types/common"
import { ref, unref, watchEffect } from "vue"

// Props
interface Props {
  item: FormItem | null
}
const props = defineProps<Props>()

const formItem = ref<FormItem | null>(null)

watchEffect(() => {
  // Update form item with unref for providing reactivity
  formItem.value = unref(props.item)
})
</script>
