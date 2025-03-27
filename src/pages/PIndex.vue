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
            :form-values="formState.values"
          />

          <button
            type="submit"
            class="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Submit
          </button>
        </form>
      </main>

      <aside class="col-span-3">
        <h2>Form State</h2>
        <pre>{{ formState.values }}</pre>
      </aside>
    </div>
  </section>
</template>

<script setup lang="ts">
import * as data from "@/data/forms.json"
import { reactive, ref } from "vue"
import type { FormGroup, FormState } from "@/types/common"
import FormWrapper from "@/components/Common/FormGroup.vue"
import { useFormValidation } from "@/composables/useFormValidation"
import { createFormDTO } from "@/types/formUtils"

const forms = ref(data.forms as FormGroup[])

const formState = reactive<FormState>({
  values: {},
  errors: {},
  touched: {},
})

const { v$, submitForm } = useFormValidation(forms.value, formState.values)

const onSubmit = async () => {
  const isValid = await submitForm()

  if (isValid) {
    // Create DTO and process form
    const formDTO = createFormDTO(formState.values)
    console.log("Form submitted successfully", formDTO)
  } else {
    console.log("Form validation failed")
  }
}
</script>
