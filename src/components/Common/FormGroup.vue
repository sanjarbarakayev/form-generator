<template>
  <div
    :class="containerClasses"
    @dragover.prevent="onDragOver"
    @dragleave="onDragLeave"
    @drop.prevent="onDrop"
  >
    <TransitionGroup name="list">
      <FormGenerator
        v-for="formItem in orderedItems"
        :key="formItem.id"
        v-bind="{ formItem, validation, formValues }"
        @on-edit="$emit('on-edit', formItem)"
        @dragging="handleItemDrag"
        @drag-end="handleDragEnd"
        :data-id="formItem.id"
      />
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import type { FormGroup, FormItem, FormValues } from "@/types/form"
import FormGenerator from "@/components/Common/FormGenerator.vue"
import { getColumnClass } from "@/utils/common"
import { computed, onMounted, onUnmounted, ref } from "vue"

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
  reorder: [items: FormItem[]]
}
const emit = defineEmits<Emits>()

const isDraggingOver = ref(false) // For external drop

const containerClasses = computed(() => [
  "transition-all duration-300 grid gap-4 relative border-2 border-dashed border-transparent rounded mb-5",
  getColumnClass(props.form.cols),
  { "!border-blue-500": isDraggingOver.value },
])

// Handles the drag enter event
const onDragOver = () => {
  isDraggingOver.value = true
}

// Handles the drag leave event
const onDragLeave = () => {
  isDraggingOver.value = false
}

// Handles the drop event
const onDrop = () => {
  isDraggingOver.value = false
  emit("on-drop", props.form.id)
}

const container = ref<HTMLElement | null>(null)
const isInternalDragging = ref(false) // For internal reordering
const currentlyDraggingId = ref<number | null>(null)
const itemsRects = ref<Map<number, DOMRect>>(new Map())

const orderedItems = computed(() => {
  return [...props.form.items].sort((a, b) => a.order - b.order)
})

// New internal drag handlers (for reordering existing items)
const handleItemDrag = (data: {
  id: number
  x: number
  y: number
  width: number
  height: number
}) => {
  currentlyDraggingId.value = data.id
  isInternalDragging.value = true

  // Get all item positions if not already cached
  if (itemsRects.value.size === 0) {
    updateItemRects()
  }

  let newOrder = -1
  let closestDistance = Infinity
  const draggedCenterX = data.x + data.width / 2
  const draggedCenterY = data.y + data.height / 2

  props.form.items.forEach((item) => {
    if (item.id === data.id) return

    const rect = itemsRects.value.get(item.id)
    if (!rect) return

    const itemCenterX = rect.left + rect.width / 2
    const itemCenterY = rect.top + rect.height / 2

    const distanceX = Math.abs(draggedCenterX - itemCenterX)
    const distanceY = Math.abs(draggedCenterY - itemCenterY)

    // Check if we're overlapping more than 50%
    if (
      distanceX < (data.width + rect.width) / 2 &&
      distanceY < (data.height + rect.height) / 2
    ) {
      const currentDistance = Math.min(distanceX, distanceY)
      if (currentDistance < closestDistance) {
        closestDistance = currentDistance

        // Determine direction based on grid columns
        if (props.form.cols > 1 && distanceX < distanceY * 1.5) {
          // Horizontal reordering in multi-column layout
          newOrder = draggedCenterX < itemCenterX ? item.order : item.order + 1
        } else {
          // Vertical reordering
          newOrder = draggedCenterY < itemCenterY ? item.order : item.order + 1
        }
      }
    }
  })

  if (newOrder !== -1 && currentlyDraggingId.value) {
    const draggedItem = props.form.items.find(
      (item) => item.id === currentlyDraggingId.value
    )
    if (draggedItem && newOrder !== draggedItem.order) {
      const newItems = reorderItems(draggedItem, newOrder)
      emit("reorder", newItems)
    }
  }
}

const reorderItems = (draggedItem: FormItem, newOrder: number) => {
  return props.form.items.map((item) => {
    if (item.id === draggedItem.id) {
      return { ...item, order: newOrder }
    }

    if (newOrder < draggedItem.order) {
      if (item.order >= newOrder && item.order < draggedItem.order) {
        return { ...item, order: item.order + 1 }
      }
    } else {
      if (item.order <= newOrder && item.order > draggedItem.order) {
        return { ...item, order: item.order - 1 }
      }
    }

    return item
  })
}

const handleDragEnd = () => {
  isInternalDragging.value = false
  currentlyDraggingId.value = null
  // Small timeout to allow transition to complete before recalculating
  setTimeout(updateItemRects, 300)
}

const updateItemRects = () => {
  if (!container.value) return

  itemsRects.value.clear()
  const children = container.value.querySelectorAll("[data-id]")

  children.forEach((child) => {
    const id = parseInt(child.getAttribute("data-id") || "0")
    if (id) {
      itemsRects.value.set(id, child.getBoundingClientRect())
    }
  })
}

// Setup observers and event listeners
onMounted(() => {
  updateItemRects()
  window.addEventListener("resize", updateItemRects)
})

onUnmounted(() => {
  window.removeEventListener("resize", updateItemRects)
})
</script>

<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translate(10px, 10px);
}
</style>
