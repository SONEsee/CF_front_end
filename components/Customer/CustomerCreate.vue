<script lang="ts" setup>
import { UseCustomerStore } from "@/stores/customer";
import { UseUploadStore } from "@/stores/upload";
import { UseShopStore } from "@/stores/shop";
import notfoundImage from "@/assets/img/404.png";

const store = UseCustomerStore();
const uploadStore = UseUploadStore();
const shopStore = UseShopStore();
const permission = UsePagePermission();
const loading = computed(() => store.loading || uploadStore.loading);
const form = ref();
const file = ref();
const selectedFile = ref<File | null>(null);
const shopOptionsLoading = computed(() => shopStore.shop_options_loading);

const request = ref({
  shop_id: null as number | null,
  customer_name: "",
  phone_number: "",
  social_platform_id: "",
  tags: "",
  note: "",
});

onMounted(() => {
  shopStore.GetShopOptions();
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

  let profilePicUrl: string | undefined;
  if (selectedFile.value) {
    const uploadedUrl = await uploadStore.UploadImage(selectedFile.value, "customer");
    if (!uploadedUrl) return;
    profilePicUrl = uploadedUrl;
  }

  await store.CreateData({
    shop_id: request.value.shop_id as number,
    customer_name: request.value.customer_name || undefined,
    phone_number: request.value.phone_number || undefined,
    social_platform_id: request.value.social_platform_id || undefined,
    tags: request.value.tags || undefined,
    note: request.value.note || undefined,
    profile_pic_url: profilePicUrl,
  });
};
</script>

<template>
  <section class="pa-6">
    <v-card elevation="0" class="pa-6">
      <GlobalTextTitleLine title="ເພີ່ມລູກຄ້າ" class="mb-8">
        <template v-if="permission.can_create" #actions>
          <v-btn color="primary" flat type="submit" form="customer-create-form" :loading="loading"
            >ບັນທຶກ</v-btn
          >
        </template>
      </GlobalTextTitleLine>

      <GlobalPermissionDenied v-if="!permission.can_create" />

      <v-form v-else id="customer-create-form" ref="form" @submit.prevent="submitForm">
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
                  text="ອັບໂຫຼດຮູບລູກຄ້າ"
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
            <label class="d-block mb-2">ຊື່ລູກຄ້າ / Customer name</label>
            <v-text-field
              v-model="request.customer_name"
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
            <label class="d-block mb-2">ເບີໂທ / Phone</label>
            <v-text-field
              v-model="request.phone_number"
              density="compact"
              variant="outlined"
              hide-details="auto"
              class="mb-6"
            ></v-text-field>

            <label class="d-block mb-2">Social Platform ID</label>
            <v-text-field
              v-model="request.social_platform_id"
              placeholder="fb_user_id / line_user_id"
              density="compact"
              variant="outlined"
              hide-details="auto"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="3">
            <label class="d-block mb-2">Tags</label>
            <v-text-field
              v-model="request.tags"
              placeholder="VIP, ລູກຄ້າປະຈຳ"
              density="compact"
              variant="outlined"
              hide-details="auto"
              class="mb-6"
            ></v-text-field>

            <label class="d-block mb-2">ໝາຍເຫດ / Note</label>
            <v-textarea
              v-model="request.note"
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
