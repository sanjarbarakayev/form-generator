<template>
  <section>
    <h2 class="text-lg font-semibold mb-2">Form element controller</h2>
    <ul v-if="formItem" class="flex flex-col gap-4">
      <!-- General controllers -->
      <!-- Label controller -->
      <li>
        <label for="label" class="block mb-2">Label</label>
        <ElInput v-model="formItem.label" placeholder="Enter label" />
      </li>
      <!-- Placeholder controller -->
      <li>
        <label for="placeholder" class="block mb-2">Placeholder</label>
        <ElInput
          v-model="formItem.placeholder"
          type="numbe"
          placeholder="Enter placeholder"
        />
      </li>
      <!-- Order controller -->
      <li>
        <label for="order" class="block mb-2">Order</label>
        <ElInputNumber
          v-model="formItem.order"
          placeholder="Enter order"
          :min="1"
          @change="handleOrderChange"
        />
      </li>

      <!-- Checkbox controllers -->
    </ul>
  </section>
</template>

<script setup lang="ts">
import type { FormItem } from "@/types/form"
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

const handleOrderChange = () => {
  // Update the other items in group
}
</script>
