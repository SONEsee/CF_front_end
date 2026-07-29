<script lang="ts" setup>
import { UseProductImageStore } from "@/stores/productImage";

const props = defineProps<{ productId: number }>();

const store = UseProductImageStore();
const permission = UsePagePermission();
const fileInput = ref();

const images = computed(
  () => [...(store.response_query_data?.list_data ?? [])].sort((a, b) => a.sort_order - b.sort_order)
);

onMounted(async () => {
  store.request_query_data.product_id = props.productId;
  await store.GetListData();
});

const openFilePicker = () => {
  fileInput.value.click();
};

const onFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  target.value = "";
  if (!file) return;
  const nextSortOrder = images.value.length;
  await store.UploadAndCreate(file, props.productId, nextSortOrder);
};
</script>

<template>
  <div>
    <div class="d-flex justify-space-between align-center mb-4">
      <div class="text-subtitle-1">ຮູບພາບເພີ່ມເຕີມຂອງສິນຄ້າ</div>
      <v-btn
        v-if="permission.can_create"
        color="primary"
        elevation="0"
        :loading="store.loading"
        @click="openFilePicker"
      >
        <v-icon class="mr-2">mdi-cloud-upload-outline</v-icon>
        ເພີ່ມຮູບ
      </v-btn>
      <input
        type="file"
        ref="fileInput"
        style="display: none"
        accept="image/jpg,image/png,image/jpeg,image/webp"
        @change="onFileChange"
      />
    </div>

    <v-row v-if="images.length">
      <v-col v-for="image in images" :key="image.id" cols="6" sm="4" md="3">
        <v-card rounded="lg" elevation="1">
          <v-img :src="image.image_url" height="140" cover></v-img>
          <v-card-actions class="d-flex justify-space-between align-center">
            <span class="text-caption text-grey">ລຳດັບ {{ image.sort_order }}</span>
            <v-btn
              v-if="permission.can_delete"
              color="error"
              icon="mdi-delete"
              variant="text"
              size="small"
              @click="store.DeleteData(image.id)"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <div v-else class="text-center py-8 text-grey">ຍັງບໍ່ມີຮູບພາບເພີ່ມເຕີມ</div>
  </div>
</template>
