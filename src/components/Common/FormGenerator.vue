<template>
  <div :style="{ order: formItem.order }">
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
import { useFormField } from "@/composables/useFormField"

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

// Use the composable to get all the form field logic
const {
  values,
  subOptions,
  getComponentType,
  hasOptions,
  getOptionComponent,
  isComplexType,
  getComponentProps,
  onSelectOption,
  fieldHasErrors,
  fieldErrors,
} = useFormField(props.formItem, props.formValues, props.validation)
</script>
