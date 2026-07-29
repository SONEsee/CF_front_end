<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
  submenuId: 10,
});
</script>
<template>
    <ModuleList/>
</template>
