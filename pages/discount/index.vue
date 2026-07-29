<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
  submenuId: 16,
});
</script>
<template>
  <DiscountList />
</template>
