<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
  submenuId: 1,
});
</script>
<template>
    <UserCreate />
</template>