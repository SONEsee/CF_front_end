<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
  submenuId: 3,
});
</script>
<template>
    <PermissionCreate/>
</template>
