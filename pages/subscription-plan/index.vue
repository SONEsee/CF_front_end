<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
  submenuId: 13,
});
</script>
<template>
  <SubscriptionPlanList />
</template>
