<script lang="ts" setup>
import { useRoute } from "vue-router";
import { UseProductStore } from "@/stores/product";
import { UseUploadStore } from "@/stores/upload";
import { UseCategoryStore } from "@/stores/category";
import notfoundImage from "@/assets/img/404.png";

const route = useRoute();
const id = route.query.id as string;
const store = UseProductStore();
const uploadStore = UseUploadStore();
const categoryStore = UseCategoryStore();
const permission = UsePagePermission();
const loading = computed(() => store.loading || uploadStore.loading);
const form = ref();
const file = ref();
const selectedFile = ref<File | null>(null);
const existingImageUrl = ref<string | null>(null);
const categoryOptionsLoading = computed(() => categoryStore.category_options_loading);

const request = ref({
  category_id: null as number | null,
  product_name: "",
  description: "",
  is_active: true,
});

const previewImage = computed(() => {
  if (selectedFile.value) return GetImageUrl(selectedFile.value);
  return existingImageUrl.value ?? notfoundImage;
});

const activeTab = ref("general");
const productIdNumber = computed(() => Number(id));

onMounted(async () => {
  categoryStore.GetCategoryOptions();

  await store.GetDetailData(id);
  const product = store.response_detail_query_data;
  if (product) {
    request.value.category_id = product.category_id;
    request.value.product_name = product.product_name;
    request.value.description = product.description;
    request.value.is_active = product.is_active;
    existingImageUrl.value = product.image_main_url || null;
  }
});

const openFile = () => {
  file.value.click();
};

const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  selectedFile.value = target.files?.[0] ?? null;
};

const submitForm = async () => {
  const { valid } = await form.value.validate();
  if (!valid) return;

  let imageMainUrl = existingImageUrl.value ?? undefined;
  if (selectedFile.value) {
    const uploadedUrl = await uploadStore.UploadImage(selectedFile.value, "product");
    if (!uploadedUrl) return;
    imageMainUrl = uploadedUrl;
  }

  await store.UpdateData(id, {
    category_id: request.value.category_id,
    product_name: request.value.product_name,
    description: request.value.description || undefined,
    is_active: request.value.is_active,
    image_main_url: imageMainUrl,
  });
};
</script>

<template>
  <section class="pa-6">
    <v-card elevation="0" class="pa-6">
      <GlobalTextTitleLine title="ແກ້ໄຂສິນຄ້າ" class="mb-8">
        <template v-if="permission.can_update" #actions>
          <v-btn color="primary" flat type="submit" form="product-edit-form" :loading="loading"
            >ບັນທຶກ</v-btn
          >
        </template>
      </GlobalTextTitleLine>

      <GlobalPermissionDenied v-if="!permission.can_update" />

      <template v-else>
        <v-tabs v-model="activeTab" class="mb-6">
          <v-tab value="general">ຂໍ້ມູນທົ່ວໄປ</v-tab>
          <v-tab value="variant">ຕົວເລືອກສິນຄ້າ</v-tab>
          <v-tab value="image">ຮູບພາບ</v-tab>
        </v-tabs>

        <v-window v-model="activeTab">
          <v-window-item value="general">
      <v-form id="product-edit-form" ref="form" @submit.prevent="submitForm">
        <v-row>
          <v-col cols="12" md="3">
            <v-row>
              <v-col cols="12" class="d-flex flex-wrap justify-center">
                <v-avatar size="180" class="mx-auto" :image="previewImage"> </v-avatar>
              </v-col>

              <v-col cols="12" class="d-flex flex-wrap justify-center">
                <v-btn
                  class="mt-4 mb-7"
                  width="180px"
                  height="40px"
                  color="primary"
                  flat
                  prepend-icon="mdi-cloud-upload-outline"
                  text="ອັບໂຫຼດຮູບສິນຄ້າ"
                  @click="openFile"
                >
                </v-btn>

                <input
                  type="file"
                  ref="file"
                  style="display: none"
                  accept="image/jpg,image/png,image/jpeg,image/webp"
                  @change="onFileChange"
                />
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12" md="3">
            <label class="d-block mb-2">ຊື່ສິນຄ້າ / Product name</label>
            <v-text-field
              v-model="request.product_name"
              :rules="[(v: string) => !!v || 'ກະລຸນາປ້ອນຊື່ສິນຄ້າ']"
              density="compact"
              variant="outlined"
              hide-details="auto"
              class="mb-6"
            ></v-text-field>

            <label class="d-block mb-2">ໝວດໝູ່ / Category</label>
            <v-autocomplete
              :items="categoryStore.category_options"
              :loading="categoryOptionsLoading"
              v-model.number="request.category_id"
              item-title="name"
              item-value="id"
              clearable
              density="compact"
              variant="outlined"
              hide-details="auto"
            ></v-autocomplete>
          </v-col>

          <v-col cols="12" md="3">
            <label class="d-block mb-2">ລາຍລະອຽດ / Description</label>
            <v-textarea
              v-model="request.description"
              density="compact"
              variant="outlined"
              hide-details="auto"
            ></v-textarea>
          </v-col>

          <v-col cols="12" md="3">
            <v-switch v-model="request.is_active" label="ເປີດໃຊ້ງານ" color="primary"></v-switch>
          </v-col>
        </v-row>
      </v-form>
          </v-window-item>

          <v-window-item value="variant">
            <ProductVariantList v-if="productIdNumber" :product-id="productIdNumber" />
          </v-window-item>

          <v-window-item value="image">
            <ProductImageList v-if="productIdNumber" :product-id="productIdNumber" />
          </v-window-item>
        </v-window>
      </template>
    </v-card>
  </section>
</template>
