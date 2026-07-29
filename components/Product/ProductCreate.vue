<script lang="ts" setup>
import { UseProductStore } from "@/stores/product";
import { UseUploadStore } from "@/stores/upload";
import { UseShopStore } from "@/stores/shop";
import { UseCategoryStore } from "@/stores/category";
import notfoundImage from "@/assets/img/404.png";

const store = UseProductStore();
const uploadStore = UseUploadStore();
const shopStore = UseShopStore();
const categoryStore = UseCategoryStore();
const permission = UsePagePermission();
const loading = computed(() => store.loading || uploadStore.loading);
const form = ref();
const file = ref();
const selectedFile = ref<File | null>(null);
const shopOptionsLoading = computed(() => shopStore.shop_options_loading);
const categoryOptionsLoading = computed(() => categoryStore.category_options_loading);

const request = ref({
  shop_id: null as number | null,
  category_id: null as number | null,
  product_name: "",
  description: "",
});

onMounted(() => {
  shopStore.GetShopOptions();
  categoryStore.GetCategoryOptions();
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

  let imageMainUrl: string | undefined;
  if (selectedFile.value) {
    const uploadedUrl = await uploadStore.UploadImage(selectedFile.value, "product");
    if (!uploadedUrl) return;
    imageMainUrl = uploadedUrl;
  }

  await store.CreateData({
    shop_id: request.value.shop_id as number,
    category_id: request.value.category_id,
    product_name: request.value.product_name,
    description: request.value.description || undefined,
    image_main_url: imageMainUrl,
  });
};
</script>

<template>
  <section class="pa-6">
    <v-card elevation="0" class="pa-6">
      <GlobalTextTitleLine title="ເພີ່ມສິນຄ້າ" class="mb-8">
        <template v-if="permission.can_create" #actions>
          <v-btn color="primary" flat type="submit" form="product-create-form" :loading="loading"
            >ບັນທຶກ</v-btn
          >
        </template>
      </GlobalTextTitleLine>

      <GlobalPermissionDenied v-if="!permission.can_create" />

      <v-form v-else id="product-create-form" ref="form" @submit.prevent="submitForm">
        <v-row>
          <v-col cols="12" md="3">
            <v-row>
              <v-col cols="12" class="d-flex flex-wrap justify-center">
                <v-avatar
                  size="180"
                  class="mx-auto"
                  :image="selectedFile ? GetImageUrl(selectedFile) : notfoundImage"
                >
                </v-avatar>
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

            <label class="d-block mb-2">ຮ້ານຄ້າ / Shop</label>
            <v-autocomplete
              :items="shopStore.shop_options"
              :loading="shopOptionsLoading"
              v-model.number="request.shop_id"
              item-title="shop_name"
              item-value="id"
              :rules="[(v: number) => !!v || 'ກະລຸນາເລືອກຮ້ານຄ້າ']"
              density="compact"
              variant="outlined"
              hide-details="auto"
            ></v-autocomplete>
          </v-col>

          <v-col cols="12" md="3">
            <label class="d-block mb-2">ໝວດໝູ່ / Category</label>
            <v-autocomplete
              :items="categoryStore.category_options"
              :loading="categoryOptionsLoading"
              v-model.number="request.category_id"
              item-title="name"
              item-value="id"
              clearable
              placeholder="ກະລຸນາເລືອກໝວດໝູ່ (ຖ້າມີ)"
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
        </v-row>
      </v-form>
    </v-card>
  </section>
</template>
