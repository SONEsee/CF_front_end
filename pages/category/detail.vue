<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
});

import { useRoute } from "vue-router";
import { onMounted } from "vue";
import { UseCategoryStore } from "~/stores/category";

const categoryStore = UseCategoryStore();
const route = useRoute();
const id = route.query.id; // ປ່ຽນຈາກ ID ເປັນ id (ຕົວນ້ອຍ)

onMounted(() => {
  console.log("Route ID:", id);
  categoryStore.GetDetailCategory(id?.toString() ?? null);
});
</script>

<template>
  <section class="pa-6">
    <v-card min-height="95vh" flat class="pa-6">
      <Detail />
    </v-card>
  </section>
</template>