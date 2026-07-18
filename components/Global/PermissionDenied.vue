<script lang="ts" setup>
defineProps({
  text: {
    type: String,
    required: false,
    default: "ທ່ານບໍ່ມີສິດອະນຸຍາດໃຫ້ໃຊ້ງານໜ້ານີ້",
  },
});
</script>

<template>
  <v-alert type="warning" variant="tonal" class="ma-6">
    {{ text }}
  </v-alert>
</template>
