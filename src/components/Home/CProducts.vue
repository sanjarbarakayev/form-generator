<template>
  <section class="grid grid-cols-2">
    <CommonCard v-for="i of 4">
      <p>Card content - {{ i }}</p>
    </CommonCard>
  </section>
</template>

<script setup>
import CommonCard from "@/components/Common/CCard.vue";
</script>
