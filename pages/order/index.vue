<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
  submenuId: 17,
});
</script>
<template>
  <OrderList />
</template>
