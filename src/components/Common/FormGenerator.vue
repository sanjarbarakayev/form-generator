<template>
  <div>
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
      <ElIcon
        v-if="formItem.editControllerAvailable"
        :size="20"
        class="cursor-pointer text-gray-500 hover:text-blue-500"
        @click="$emit('on-edit')"
      >
        <Edit />
      </ElIcon>
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
import type { Option } from "element-plus/es/components/select-v2/src/select.types"
import { computed, ref, unref } from "vue"

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
}
defineEmits<Emits>()

// Unref form values to get reactive values
const values = unref(props.formValues)

// Reactive sub options for parent-child select relationship
const subOptions = ref<Option[]>([])

// Maps form field types to component types
const getComponentType = (type: string): string => {
  const componentMap: Record<string, string> = {
    input: "ElInput",
    textarea: "ElInput",
    checkbox: "ElCheckbox",
    checkboxGroup: "ElCheckboxGroup",
    radio: "ElRadio",
    radioGroup: "ElRadioGroup",
    date: "ElDatePicker",
  }

  return componentMap[type] || "div"
}

// Checks if a form type has options (checkbox, radio, select)
const hasOptions = (type: string): boolean => {
  return ["select", "checkboxGroup", "radioGroup"].includes(type)
}

// Returns the appropriate option component based on the field type
const getOptionComponent = (type: string): string => {
  const optionMap: Record<string, string> = {
    select: "ElOption",
    checkboxGroup: "ElCheckbox",
    radioGroup: "ElRadio",
  }

  return optionMap[type] || ""
}

// Checks if a form type requires special handling outside of dynamic components
const isComplexType = (type: string): boolean => {
  return ["select"].includes(type)
}

// Generates appropriate props for each component type
const getComponentProps = (formItem: FormItem): Record<string, any> => {
  const commonProps = {
    placeholder: formItem.placeholder,
    key: formItem.key,
  }

  const typeSpecificProps: Record<string, Record<string, any>> = {
    input: {
      type: formItem.variant || "text",
    },
    textarea: {
      type: "textarea",
      rows: formItem.rows || 3,
    },
    date: {},
    checkbox: {
      label: formItem.selectionLabel,
    },
    radio: {
      label: formItem.selectionLabel,
    },
  }

  return { ...commonProps, ...(typeSpecificProps[formItem.type] || {}) }
}

// Handles the selection of an option in a parent select field
const onSelectOption = (formItem: FormItem) => {
  if (formItem.options) {
    // Get selected option
    const selectedOption = formItem.options.find(
      (option) => option.id === values[formItem.key]
    )

    // Update sub options
    subOptions.value = selectedOption?.options || []

    // Reset child field value when parent option changes
    if (formItem.childKey) {
      values[formItem.childKey] = undefined
    }
  }
}

// Checks if a field has validation errors
const fieldHasErrors = (key: string): boolean => {
  return Boolean(props.validation[key]?.$errors?.length)
}

// Gets the validation errors for a specific field
const fieldErrors = computed(() => {
  const fieldValidation = props.validation[props.formItem.key]
  return fieldValidation?.$errors.map((error: any) => error.$message) || []
})
</script>
