<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
  submenuId: 11,
});
</script>
<template>
  <CategoryList />
</template>
