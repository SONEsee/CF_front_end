<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
  submenuId: 6,
});
</script>
<template>
  <section class="pa-6">
    <v-card min-height="95vh" flat class="pa-6">
      <ShopDetail />
    </v-card>
  </section>
</template>
