<template>
  <div
    :class="containerClasses"
    @dragover.prevent="onDragOver"
    @dragleave="onDragLeave"
    @drop.prevent="onDrop"
  >
    <FormGenerator
      v-for="formItem in form.items"
      :key="formItem.id"
      v-bind="{ formItem, validation, formValues }"
      @on-edit="$emit('on-edit', formItem)"
    />
  </div>
</template>

<script setup lang="ts">
import type { FormGroup, FormItem, FormValues } from "@/types/common"
import FormGenerator from "@/components/Common/FormGenerator.vue"
import { getColumnClass } from "@/utils/common"
import { computed, ref } from "vue"

// Props
interface Props {
  form: FormGroup
  formValues: FormValues
  validation: any
}
const props = defineProps<Props>()

// Emits
interface Emits {
  "on-drop": [formId: number]
  "on-edit": [formItem: FormItem]
}
const emit = defineEmits<Emits>()

const containerClasses = computed(() => [
  "transition-all duration-300 grid gap-4 relative border-2 border-dashed border-transparent rounded",
  getColumnClass(props.form.cols),
  { "!border-blue-500": isDragging.value },
])

const isDragging = ref(false)

// Handles the drag enter event
const onDragOver = () => {
  isDragging.value = true
}

// Handles the drag leave event
const onDragLeave = () => {
  isDragging.value = false
}

// Handles the drop event
const onDrop = () => {
  isDragging.value = false
  emit("on-drop", props.form.id)
}
</script>
