<template>
  <div class="mb-5">
    <!-- Label -->
    <div class="flex items-center justify-between">
      <label class="block mb-2" :for="formItem.name">
        {{ formItem.label }}
      </label>
      <ElIcon
        v-if="formItem.editControllerAvailable"
        :size="20"
        class="cursor-pointer text-gray-500 hover:text-blue-500"
        @click="$emit('on-edit')"
      >
        <Edit />
      </ElIcon>
    </div>

    <!-- Input -->
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

    <!-- Textarea -->
    <ElInput
      v-if="formItem.type === 'textarea'"
      type="textarea"
      :id="formItem.name"
      v-model="values[formItem.key]"
      :name="formItem.name"
      :rows="formItem.rows"
      :placeholder="formItem.placeholder"
    />

    <!-- Checkbox -->
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

    <!-- Radio -->
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

    <!-- Date -->
    <ElDatePicker
      v-if="formItem.type === 'date'"
      :id="formItem.name"
      v-model="values[formItem.key]"
      :name="formItem.name"
      :placeholder="formItem.placeholder"
    />

    <!-- Select -->
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

      <!-- Child Select -->
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

// Unref form values to get reactive values
const values = unref(props.formValues)

// Reactive sub options
const subOptions = ref()

const onSelectOption = (formItem: FormItem) => {
  if (formItem.options) {
    // Get selected option id
    const selectedOptionId = values[formItem.key]

    // Get selected option
    const selectedOption = formItem.options.find(
      (option) => option.id === selectedOptionId
    )

    // Update selected option id in values. values - the main form values object in the parent
    values[formItem.key] = selectedOption?.id

    // Update sub options
    subOptions.value = selectedOption?.options

    // Reset child field value when child key is present and parent option is selected/updated
    if (formItem.childKey) {
      values[formItem.childKey] = undefined
    }
  }
}

// Compute field-specific errors
const fieldErrors = computed(() => {
  const fieldValidation = props.validation[props.formItem.key]
  return fieldValidation?.$errors.map((error: any) => error.$message) || []
})
</script>
