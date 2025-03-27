<template>
  <section>
    <h1>Forms</h1>

    <div class="grid grid-cols-12 gap-10">
      <aside class="col-span-3">
        <h2>Drag n Drop</h2>
      </aside>
      <main class="col-span-6">
        <FormWrapper
          v-for="form in forms"
          :key="form.name"
          :form
          :form-values="formState.values"
          @submit="onSubmit"
        />
      </main>
      <aside class="col-span-3">
        <h2>
          Values
          <pre>{{ formState.values }}</pre>
        </h2>
      </aside>
    </div>
  </section>
</template>

<script setup lang="ts">
import * as data from "@/data/forms.json"
import { reactive, ref } from "vue"
import type { FormGroup, FormState } from "@/types/common"
import FormWrapper from "@/components/Common/FormWrapper.vue"

const forms = ref(data.forms as FormGroup[])

const formState = reactive<FormState>({
  values: {},
  errors: {},
  touched: {},
})
const onSubmit = () => {
  console.log(formState.values)
}
</script>
