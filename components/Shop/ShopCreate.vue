<script lang="ts" setup>
import { UseShopStore } from "@/stores/shop";
import { UseUploadStore } from "@/stores/upload";
import notfoundImage from "@/assets/img/404.png";

const shopStore = UseShopStore();
const uploadStore = UseUploadStore();
const permission = UsePagePermission();
const loading = computed(() => shopStore.loading || uploadStore.loading);
const form = ref();
const file = ref();
const selectedFile = ref<File | null>(null);

const request = ref({
  shop_name: "",
  phone: "",
  timezone: "",
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

  let imageUrl: string | undefined;
  if (selectedFile.value) {
    const uploadedUrl = await uploadStore.UploadImage(selectedFile.value, "shop");
    if (!uploadedUrl) return;
    imageUrl = uploadedUrl;
  }

  await shopStore.CreateData({
    shop_name: request.value.shop_name,
    owner_user_id: GetCurrentUserId(),
    phone: request.value.phone || undefined,
    timezone: request.value.timezone || undefined,
    image_url: imageUrl,
  });
};
</script>

<template>
  <section class="pa-6">
    <v-card elevation="0" class="pa-6">
      <GlobalTextTitleLine title="ເພີ່ມຮ້ານຄ້າ" class="mb-8">
        <template v-if="permission.can_create" #actions>
          <v-btn color="primary" flat type="submit" form="shop-create-form" :loading="loading"
            >ບັນທຶກ</v-btn
          >
        </template>
      </GlobalTextTitleLine>

      <GlobalPermissionDenied v-if="!permission.can_create" />

      <v-form v-else id="shop-create-form" ref="form" @submit.prevent="submitForm">
        <v-row>
          <v-col cols="12" md="4">
            <v-row>
              <v-col cols="12" class="d-flex flex-wrap justify-center">
                <v-avatar
                  size="220"
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
                  text="ອັບໂຫຼດຮູບໂລໂກ້"
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

          <v-col cols="12" md="4">
            <label class="d-block mb-2">ຊື່ຮ້ານຄ້າ / Shop name</label>
            <v-text-field
              v-model="request.shop_name"
              :rules="[(v: string) => !!v || 'ກະລຸນາປ້ອນຊື່ຮ້ານຄ້າ']"
              placeholder="ກະລຸນາປ້ອນຊື່ຮ້ານຄ້າ"
              density="compact"
              variant="outlined"
              hide-details="auto"
              class="mb-6"
            ></v-text-field>

            <label class="d-block mb-2">ເບີໂທລະສັບ / Phone</label>
            <v-text-field
              v-model="request.phone"
              placeholder="ກະລຸນາປ້ອນເບີໂທລະສັບ"
              density="compact"
              variant="outlined"
              hide-details="auto"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="4">
            <label class="d-block mb-2">Timezone</label>
            <v-text-field
              v-model="request.timezone"
              placeholder="ຕົວຢ່າງ: Asia/Vientiane"
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
