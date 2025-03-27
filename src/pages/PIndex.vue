<template>
  <section>
    <h1>Form Generator</h1>

    <div class="grid grid-cols-12 gap-10">
      <aside class="col-span-3">
        <h2>Form Management</h2>
        <!-- Potential drag-and-drop or form configuration area -->
      </aside>

      <main class="col-span-6">
        <form @submit.prevent="onSubmit">
          <FormWrapper
            v-for="form in forms"
            :key="form.name"
            :form
            :validation="v$"
            :form-values="formValues"
          />

          <button
            type="submit"
            class="bg-blue-500 text-white py-2 px-4 rounded mr-2"
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

      <aside class="col-span-3">
        <h2>Form State</h2>
        <pre>{{ formValues }}</pre>
      </aside>
    </div>
  </section>
</template>

<script setup lang="ts">
import * as data from "@/data/forms.json"
import FormWrapper from "@/components/Common/FormGroup.vue"
import { useFormValidation } from "@/composables/useFormValidation"
import { createFormDTO } from "@/types/formUtils"
import { useFormState } from "@/composables/useFormState"
import type { FormGroup } from "@/types/common"

const { forms, formValues, resetForm } = useFormState(data.forms as FormGroup[])
const { v$, submitForm } = useFormValidation(forms.value, formValues)

const onSubmit = async () => {
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
