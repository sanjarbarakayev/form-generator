<template>
  <section>
    <h1>Forms</h1>

    <div>
      <div v-for="form in forms" :key="form.id">
        <h2>{{ form.label }}</h2>
        <ElInput v-if="form.type === 'input'" v-model="values[form.key]" />
        <ElCheckbox v-if="form.type === 'checkbox'" v-model="values[form.key]" />
        <ElRadio v-if="form.type === 'radio'" v-model="values[form.key]" />
        <ElDate v-if="form.type === 'date'" v-model="values[form.key]" />
        <ElSelect v-if="form.type === 'select'" v-model="values[form.key]" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import * as data from "@/data/forms.json"
import { reactive } from "vue";

const forms = data.forms

const values = reactive({})
</script>
