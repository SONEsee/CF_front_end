<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
  submenuId: 5,
});
</script>
<template>
    <SubMenuList/>
</template>
