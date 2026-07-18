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
    <div>
        <UpdateCategory/>
    </div>
</template>