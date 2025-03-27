<template>
  <div
    :formValues="formValues"
    :class="['grid gap-4', getColumnClass(form.cols)]"
  >
    <FormGenerator
      v-for="formItem in form.items"
      :key="formItem.id"
      :form-item
      :validation
      :form-values="formValues"
    />
  </div>
</template>

<script setup lang="ts">
import type { FormGroup, FormValues } from "@/types/common"
import FormGenerator from "@/components/Common/FormGenerator.vue"
import { getColumnClass } from "@/utils/common"

interface Props {
  form: FormGroup
  formValues: FormValues
  validation: any
}
defineProps<Props>()
</script>
