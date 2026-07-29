<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
  submenuId: 12,
});
</script>
<template>
  <ProductCreate />
</template>
