<script lang="ts" setup>
import { useDisplay } from "vuetify";

const props = defineProps({
  page: {
    type: Number,
    required: true,
    default: 1,
  },

  limit: {
    type: Number,
    required: true,
    default: 20,
  },

  totalpage: {
    type: Number,
    required: true,
    default: 1,
  },
});

const display = useDisplay();
</script>

<template>
  <div class="d-flex flex-column flex-sm-row flex-wrap justify-space-between align-stretch align-sm-end ga-4 pt-2">
    <div class="w-100" style="max-width: 250px">
      <label> ຈຳນວນລາຍການທີ່ສະແດງ</label>
      <v-select
        variant="outlined"
        density="compact"
        :model-value="limit"
        :items="GetItemPerPageOptions()"
        @update:model-value="$emit('onSelectionChange', $event)"
      ></v-select>
    </div>

    <div class="d-flex justify-center justify-sm-end">
      <v-pagination
        class="text-black"
        :total-visible="display.smAndDown.value ? 4 : 8"
        :length="totalpage ?? 1"
        :model-value="page"
        @update:model-value="$emit('onPagechange', $event)"
      ></v-pagination>
    </div>
  </div>
</template>
