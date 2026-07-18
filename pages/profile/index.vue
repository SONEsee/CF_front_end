<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
});
</script>

<template>
  <section class="pa-6">
    <v-card class="pa-6" min-height="95vh" flat>
      <Profile />
    </v-card>
  </section>
</template>
