<template>
  <ul>
    <li
      v-for="item in draggableFormItems"
      :key="item.id"
      class="mb-5"
      draggable="true"
      @dragstart="handleDragStart(item)"
      @dragend="handleDragOver(item)"
    >
      <!-- Input -->
      <ElInput
        v-if="item.type === 'input'"
        :placeholder="item.placeholder"
        :label="item.label"
        :name="item.name"
        readonly
      />

      <!-- Select -->
      <ElSelect
        v-else-if="item.type === 'select'"
        :placeholder="item.placeholder"
        :label="item.label"
        :name="item.name"
        readonly
      >
        <ElOption
          v-for="option in item.options"
          :key="option.id"
          :label="option.label"
          :value="option.id"
        />
      </ElSelect>

      <!-- Textarea -->
      <ElInput
        v-else-if="item.type === 'textarea'"
        type="textarea"
        :placeholder="item.placeholder"
        :name="item.name"
        readonly
      />

      <!-- Date -->
      <ElDatePicker
        v-else-if="item.type === 'date'"
        :placeholder="item.placeholder"
        :name="item.name"
        readonly
      />
    </li>
  </ul>
</template>

<script setup lang="ts">
import { draggableFormItems } from "@/data/form"
import type { FormItem } from "@/types/common"

// Emits
interface Emits {
  "on-drag-start": [item: FormItem]
  "on-drag-end": [item: FormItem]
}
const emit = defineEmits<Emits>()

// Handle drag start
const handleDragStart = (item: FormItem) => {
  emit("on-drag-start", item)
}

// Handle drag end
const handleDragOver = (item: FormItem) => {
  emit("on-drag-end", item)
}
</script>
