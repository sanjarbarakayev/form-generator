<template>
  <section>
    <h1 class="text-2xl font-bold mb-10">Form Generator</h1>

    <div class="grid grid-cols-12 gap-10">
      <!-- Left Sidebar -->
      <aside class="col-span-3">
        <h2 class="text-lg font-semibold mb-2">Draggable Components</h2>
        <p class="mb-3">Drag and drop components to the form</p>

        <!-- Draggable Components -->
        <DraggableComponents
          class="mb-5"
          @on-drag-start="handleDragStart"
          @on-drag-end="handleDragEnd"
        />
      </aside>

      <!-- Main Content -->
      <main class="col-span-6">
        <form @submit.prevent="onSubmit">
          <!-- Form Wrappers -->
          <FormWrapper
            v-for="form in forms"
            :key="form.name"
            :form
            :validation="v$"
            :form-values="formValues"
            @on-drop="handleDrop"
            @on-edit="handleEdit"
          />

          <!-- Submit and Reset Buttons -->
          <button
            type="submit"
            class="bg-blue-500 text-white py-2 px-4 rounded mr-5"
          >
            Submit
          </button>
          <button
            type="reset"
            class="bg-gray-500 text-white py-2 px-4 rounded"
            @click="resetForm"
          >
            Reset
          </button>
        </form>
      </main>

      <!-- Right Sidebar -->
      <aside class="col-span-3">
        <!-- Form State -->
        <section class="mb-5">
          <h2 class="text-lg font-semibold mb-2">Form State</h2>
          <pre>{{ formValues }}</pre>
        </section>

        <!-- Form Item Controller -->
        <FormItemController :item="selectedFormItem" />
      </aside>
    </div>
  </section>
</template>

<script setup lang="ts">
import * as data from "@/data/forms.json"
import FormWrapper from "@/components/Common/FormGroup.vue"
import { useFormValidation } from "@/composables/useFormValidation"
import { createFormDTO } from "@/utils/form"
import { useFormState } from "@/composables/useFormState"
import type { FormGroup } from "@/types/common"
import DraggableComponents from "@/components/Common/DraggableComponents.vue"
import { useDragController } from "@/composables/useDragController"
import FormItemController from "@/components/Common/FormItemController.vue"
import { useFormItemController } from "@/composables/useFormItemController"

// Form State
const { forms, formValues, resetForm } = useFormState(data.forms as FormGroup[])

// Form Validation
const { v$, submitForm } = useFormValidation(forms.value, formValues)

// Drag and Drop controller
const { handleDragStart, handleDragEnd, handleDrop } = useDragController(forms)

// Form Item Controller
const { selectedFormItem, handleEdit } = useFormItemController()

// Form submission
const onSubmit = async () => {
  // Validate form
  const isValid = await submitForm()

  if (isValid) {
    // Create DTO and process form
    const formDTO = createFormDTO(formValues)
    console.log("Form submitted successfully", formDTO)
  } else {
    console.log("Form validation failed")
  }
}
</script>
