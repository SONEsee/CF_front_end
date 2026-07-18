<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
  submenuId: 6,
});
</script>
<template>
    <ShopList/>
</template>
