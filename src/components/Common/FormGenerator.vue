<template>
  <div class="mb-5">
    <label class="block mb-2" :for="formItem.name">{{ formItem.label }}</label>
    <div v-if="formItem.type === 'input'">
      <ElInput
        :id="formItem.name"
        v-model="values[formItem.key]"
        :name="formItem.name"
        :type="formItem.variant"
        :placeholder="formItem.placeholder"
        :class="{ 'el-form-item is-error !m-0': fieldErrors.length }"
        @blur="validation.$touch()"
      />
    </div>

    <ElInput
      v-if="formItem.type === 'textarea'"
      type="textarea"
      :id="formItem.name"
      v-model="values[formItem.key]"
      :name="formItem.name"
      :rows="formItem.rows"
      :placeholder="formItem.placeholder"
    />

    <ElCheckboxGroup
      v-if="formItem.type === 'checkbox'"
      v-model="values[formItem.key]"
      :name="formItem.name"
    >
      <ElCheckbox
        v-for="option in formItem.options"
        :key="option.id"
        :value="option.id"
        :label="option.label"
      />
    </ElCheckboxGroup>

    <ElRadioGroup
      v-if="formItem.type === 'radio'"
      v-model="values[formItem.key]"
      :name="formItem.name"
    >
      <ElRadio
        v-for="option in formItem.options"
        :key="option.id"
        :value="option.id"
        :label="option.label"
      />
    </ElRadioGroup>

    <ElDatePicker
      v-if="formItem.type === 'date'"
      :id="formItem.name"
      v-model="values[formItem.key]"
      :name="formItem.name"
      :placeholder="formItem.placeholder"
    />

    <div v-if="formItem.type === 'select'">
      <ElSelect
        :id="formItem.name"
        v-model="values[formItem.key]"
        :name="formItem.name"
        @change="onSelectOption(formItem)"
        :placeholder="formItem.placeholder"
      >
        <ElOption
          v-for="option in formItem.options"
          :key="option.id"
          :label="option.label"
          :value="option.id"
        />
      </ElSelect>

      <div v-if="formItem.hasChild" class="mt-2">
        <label class="block mb-2" :for="formItem.childKey">
          {{ formItem.childLabel }}
        </label>

        <ElSelect
          v-if="formItem.hasChild"
          v-model="values[formItem.childKey!]"
          :name="formItem.childName!"
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
  </div>
</template>

<script setup lang="ts">
import type { FormItem, FormValues } from "@/types/common"
import { computed, ref, unref } from "vue"

interface Props {
  formItem: FormItem
  formValues: FormValues
  validation: Record<string, any>
}
const props = defineProps<Props>()
const values = unref(props.formValues)

const subOptions = ref()

const onSelectOption = (formItem: FormItem) => {
  if (formItem.options) {
    const selectedOptionId = values[formItem.key]
    const selectedOption = formItem.options.find(
      (option) => option.id === selectedOptionId
    )

    values[formItem.key] = selectedOption?.id
    subOptions.value = selectedOption?.options
    values[formItem.childKey!] = undefined
  }
}

// Compute field-specific errors
const fieldErrors = computed(() => {
  const fieldValidation = props.validation[props.formItem.key]
  return fieldValidation?.$errors.map((error: any) => error.$message) || []
})
</script>
