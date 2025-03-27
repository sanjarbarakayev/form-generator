<template>
  <section>
    <form
      :formValues="formValues"
      :class="['grid gap-4', getWrapperClass(form.cols)]"
      @submit.prevent="$emit('submit')"
    >
      <FormGenerator
        v-for="formItem in form.items"
        :key="formItem.id"
        :form-item
        :form-values="formValues"
      />
    </form>
  </section>
</template>

<script setup lang="ts">
import type { FormGroup, FormValues } from "@/types/common"
import FormGenerator from "@/components/Common/FormGenerator.vue"
import { computed } from "vue"

interface Props {
  form: FormGroup
  formValues: FormValues
}
defineProps<Props>()

const getWrapperClass = computed(() => (cols: number) => {
  const columnClassess = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
    7: "grid-cols-7",
    8: "grid-cols-8",
    9: "grid-cols-9",
    10: "grid-cols-10",
    11: "grid-cols-11",
    12: "grid-cols-12",
  }

  return columnClassess[cols as keyof typeof columnClassess]
})
</script>
