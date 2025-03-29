<template>
  <div
    :style="{ order: formItem.order, ...cardStyle }"
    ref="card"
    class="transition-all duration-200"
  >
    <!-- Label with optional edit icon -->
    <div
      class="flex items-center justify-between"
      v-if="formItem.label || formItem.editControllerAvailable"
    >
      <label
        class="block mb-2"
        :for="formItem.name"
        :class="{ 'opacity-0': !formItem.label }"
      >
        {{ formItem.label }}
      </label>

      <div class="flex items-center gap-2">
        <!-- Drag Icon -->
        <ElIcon
          :size="20"
          class="cursor-grab text-gray-500 hover:text-blue-500"
          @mousedown="startDrag"
        >
          <Rank />
        </ElIcon>

        <!-- Edit Icon -->
        <ElIcon
          v-if="formItem.editControllerAvailable"
          :size="20"
          class="cursor-pointer text-gray-500 hover:text-blue-500"
          @click="$emit('on-edit')"
        >
          <Edit />
        </ElIcon>
      </div>
    </div>

    <!-- Dynamic form field based on type -->
    <component
      :is="getComponentType(formItem.type)"
      v-if="!isComplexType(formItem.type)"
      v-bind="getComponentProps(formItem)"
      :id="formItem.name"
      :name="formItem.name"
      v-model="values[formItem.key]"
      :class="{ 'el-form-item is-error !m-0': fieldHasErrors(formItem.key) }"
      @blur="validation.$touch()"
    >
      <!-- Render options for select, radioGroup, and checkboxGroup components -->
      <template v-if="hasOptions(formItem.type)">
        <component
          :is="getOptionComponent(formItem.type)"
          v-for="option in formItem.options"
          :key="option.id"
          :value="option.id"
          :label="option.label"
        />
      </template>
      <template v-else-if="formItem.selectionType === 'single'">
        {{ formItem.selectionLabel }}
      </template>
    </component>

    <!-- Special handling for select with child relationship -->
    <div v-if="formItem.type === 'select'">
      <ElSelect
        :id="formItem.name"
        v-model="values[formItem.key]"
        :name="formItem.name"
        :placeholder="formItem.placeholder"
        @change="onSelectOption(formItem)"
      >
        <ElOption
          v-for="option in formItem.options"
          :key="option.id"
          :label="option.label"
          :value="option.id"
        />
      </ElSelect>

      <!-- Child Select when parent has a child relationship -->
      <div v-if="formItem.hasChild" class="mt-2">
        <label class="block mb-2" :for="formItem.childKey">
          {{ formItem.childLabel }}
        </label>

        <ElSelect
          v-model="values[formItem.childKey!]"
          :name="formItem.childName"
          :placeholder="formItem.childPlaceholder"
          :disabled="!values[formItem.key]"
        >
          <ElOption
            v-for="option in subOptions"
            :key="option.id"
            :label="option.label"
            :value="option.id"
          />
        </ElSelect>
      </div>
    </div>

    <!-- Display validation errors -->
    <div v-if="fieldHasErrors(formItem.key)" class="text-red-500 text-sm mt-1">
      {{ fieldErrors[0] }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormItem, FormValues } from "@/types/form"
import { useFormField } from "@/composables/useFormField"
import { onMounted, onUnmounted, reactive, ref, computed } from "vue"

// Props
interface Props {
  formItem: FormItem
  formValues: FormValues
  validation: Record<string, any>
}
const props = defineProps<Props>()

// Emits
interface Emits {
  (e: "on-edit"): void
  (
    e: "dragging",
    position: {
      id: number
      x: number
      y: number
      width: number
      height: number
    }
  ): void
  (e: "drag-end"): void
}
const emit = defineEmits<Emits>()

// Composables
const {
  values,
  subOptions,
  getComponentType,
  hasOptions,
  getOptionComponent,
  isComplexType,
  getComponentProps,
  onSelectOption,
  fieldHasErrors,
  fieldErrors,
} = useFormField(props.formItem, props.formValues, props.validation)

const position = reactive({ x: 0, y: 0 })

onMounted(() => {
  if (card.value) {
    position.x = card.value?.offsetLeft || 0
    position.y = card.value?.offsetTop || 0
  }
})

onUnmounted(() => {
  document.removeEventListener("mousemove", onDrag)
  document.removeEventListener("mouseup", stopDrag)
})

const card = ref<HTMLElement | null>(null)
const dragging = ref(false)
const initialPosition = reactive({ x: 0, y: 0 })
const dragOffset = reactive({ x: 0, y: 0 })
const cardRect = reactive({
  width: 0,
  height: 0,
  left: 0,
  top: 0,
})

const cardStyle = computed(() => ({
  position: dragging.value ? "fixed" : "relative",
  zIndex: dragging.value ? 1000 : "auto",
  top: dragging.value ? `${initialPosition.y + dragOffset.y}px` : "auto",
  left: dragging.value ? `${initialPosition.x + dragOffset.x}px` : "auto",
  width: dragging.value ? `${cardRect.width}px` : "auto",
  height: dragging.value ? `${cardRect.height}px` : "auto",
  transform: dragging.value ? "scale(1.02)" : "none",
  boxShadow: dragging.value ? "0 4px 12px rgba(0,0,0,0.15)" : "none",
  backgroundColor: dragging.value ? "#fff" : "transparent",
  cursor: dragging.value ? "grabbing" : "grab",
}))

const startDrag = (event: MouseEvent) => {
  if (!card.value) return

  dragging.value = true
  const rect = card.value.getBoundingClientRect()

  // Store initial position and dimensions
  initialPosition.x = rect.left
  initialPosition.y = rect.top
  cardRect.width = rect.width
  cardRect.height = rect.height

  // Calculate offset from mouse to element corner
  dragOffset.x = event.clientX - rect.left
  dragOffset.y = event.clientY - rect.top

  document.addEventListener("mousemove", onDrag)
  document.addEventListener("mouseup", stopDrag)
}

const onDrag = (event: MouseEvent) => {
  console.log("onDrag", dragging.value)
  if (!dragging.value) return

  // Update drag offset
  dragOffset.x = event.clientX - initialPosition.x - dragOffset.x
  dragOffset.y = event.clientY - initialPosition.y - dragOffset.y

  // Emit drag position to parent for collision detection
  emit("dragging", {
    id: props.formItem.id,
    x: event.clientX,
    y: event.clientY,
    width: cardRect.width,
    height: cardRect.height,
  })
}

const stopDrag = () => {
  dragging.value = false
  document.removeEventListener("mousemove", onDrag)
  document.removeEventListener("mouseup", stopDrag)
  emit("drag-end")
}

onMounted(() => {
  if (card.value) {
    const rect = card.value.getBoundingClientRect()
    cardRect.width = rect.width
    cardRect.height = rect.height
  }
})

onUnmounted(() => {
  document.removeEventListener("mousemove", onDrag)
  document.removeEventListener("mouseup", stopDrag)
})

// Expose methods if needed
defineExpose({
  getRect: () => cardRect,
})
</script>
