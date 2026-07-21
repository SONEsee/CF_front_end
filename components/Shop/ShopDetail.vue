<script lang="ts" setup>
import { useRoute } from "vue-router";
import { UseShopStore } from "@/stores/shop";
import { UseUploadStore } from "@/stores/upload";
import notfoundImage from "@/assets/img/404.png";

const route = useRoute();
const id = route.query.id as string;
const shopStore = UseShopStore();
const uploadStore = UseUploadStore();
const permission = UsePagePermission();
const loading = computed(() => shopStore.loading || uploadStore.loading);
const form = ref();
const file = ref();
const selectedFile = ref<File | null>(null);
const existingImageUrl = ref<string | null>(null);

const request = ref({
  shop_name: "",
  phone: "",
  timezone: "",
});

onMounted(async () => {
  await shopStore.GetDetailData(id);
  const shop = shopStore.response_detail_query_data;
  if (shop) {
    request.value.shop_name = shop.shop_name;
    request.value.phone = shop.phone;
    request.value.timezone = shop.timezone;
    existingImageUrl.value = shop.image_url;
  }
});

const previewImage = computed(() => {
  if (selectedFile.value) return GetImageUrl(selectedFile.value);
  return existingImageUrl.value ?? notfoundImage;
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

  let imageUrl = existingImageUrl.value ?? undefined;
  if (selectedFile.value) {
    const uploadedUrl = await uploadStore.UploadImage(selectedFile.value, "shop");
    if (!uploadedUrl) return;
    imageUrl = uploadedUrl;
  }


  await shopStore.UpdateData(id, {
    shop_name: request.value.shop_name,
    phone: request.value.phone,
    timezone: request.value.timezone,
    image_url: imageUrl,
  });
};
</script>

<template>
  <section class="pa-2">
    <v-card elevation="0" class="pa-2">
      <GlobalTextTitleLine title="ແກ້ໄຂຮ້ານຄ້າ" class="">
       
      </GlobalTextTitleLine>

      <GlobalPermissionDenied v-if="!permission.can_update" />

      <v-form v-else id="shop-edit-form" ref="form" @submit.prevent="submitForm">
        <v-row>
          <v-col cols="12" md="4">
            <v-row>
              <v-col cols="12" class="d-flex flex-wrap justify-center">
                <v-avatar size="220" class="mx-auto" :image="previewImage"> </v-avatar>
              </v-col>

              <v-col cols="12" class="d-flex flex-wrap justify-center">
            

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

          <v-col cols="12" md="4">
            <label class="d-block mb-2">ຊື່ຮ້ານຄ້າ / Shop name</label>
            <v-text-field
             readonly
              v-model="request.shop_name"
              :rules="[(v: string) => !!v || 'ກະລຸນາປ້ອນຊື່ຮ້ານຄ້າ']"
              density="compact"
              variant="outlined"
              hide-details="auto"
              class="mb-6"
            ></v-text-field>

            <label class="d-block mb-2">ເບີໂທລະສັບ / Phone</label>
            <v-text-field
             readonly
              v-model="request.phone"
              density="compact"
              variant="outlined"
              hide-details="auto"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="4">
            <label class="d-block mb-2">Timezone</label>
            <v-text-field
            readonly
              v-model="request.timezone"
              density="compact"
              variant="outlined"
              hide-details="auto"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
  </section>
</template>
