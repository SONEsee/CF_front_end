<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
});

import CreateProduct from '~/components/Product/CreateProduct.vue';

</script>
<template>
    <CreateProduct />
</template>