<script lang="ts" setup>
import { useRoute } from "vue-router";
import { UseCustomerStore } from "@/stores/customer";
import { UseUploadStore } from "@/stores/upload";
import notfoundImage from "@/assets/img/404.png";

const route = useRoute();
const id = route.query.id as string;
const store = UseCustomerStore();
const uploadStore = UseUploadStore();
const permission = UsePagePermission();
const loading = computed(() => store.loading || uploadStore.loading);
const form = ref();
const file = ref();
const selectedFile = ref<File | null>(null);
const existingImageUrl = ref<string | null>(null);

const request = ref({
  customer_name: "",
  phone_number: "",
  social_platform_id: "",
  tags: "",
  note: "",
});

const previewImage = computed(() => {
  if (selectedFile.value) return GetImageUrl(selectedFile.value);
  return existingImageUrl.value ?? notfoundImage;
});

const activeTab = ref("general");
const customerIdNumber = computed(() => Number(id));

onMounted(async () => {
  await store.GetDetailData(id);
  const customer = store.response_detail_query_data;
  if (customer) {
    request.value.customer_name = customer.customer_name ?? "";
    request.value.phone_number = customer.phone_number ?? "";
    request.value.social_platform_id = customer.social_platform_id ?? "";
    request.value.tags = customer.tags ?? "";
    request.value.note = customer.note ?? "";
    existingImageUrl.value = customer.profile_pic_url;
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

  let profilePicUrl = existingImageUrl.value ?? undefined;
  if (selectedFile.value) {
    const uploadedUrl = await uploadStore.UploadImage(selectedFile.value, "customer");
    if (!uploadedUrl) return;
    profilePicUrl = uploadedUrl;
  }

  await store.UpdateData(id, {
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
      <GlobalTextTitleLine title="ແກ້ໄຂລູກຄ້າ" class="mb-8">
        <template v-if="permission.can_update" #actions>
          <v-btn color="primary" flat type="submit" form="customer-edit-form" :loading="loading"
            >ບັນທຶກ</v-btn
          >
        </template>
      </GlobalTextTitleLine>

      <GlobalPermissionDenied v-if="!permission.can_update" />

      <template v-else>
        <v-tabs v-model="activeTab" class="mb-6">
          <v-tab value="general">ຂໍ້ມູນທົ່ວໄປ</v-tab>
          <v-tab value="address">ທີ່ຢູ່</v-tab>
        </v-tabs>

        <v-window v-model="activeTab">
          <v-window-item value="general">
            <v-form id="customer-edit-form" ref="form" @submit.prevent="submitForm">
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

                  <label class="d-block mb-2">ເບີໂທ / Phone</label>
                  <v-text-field
                    v-model="request.phone_number"
                    density="compact"
                    variant="outlined"
                    hide-details="auto"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="3">
                  <label class="d-block mb-2">Social Platform ID</label>
                  <v-text-field
                    v-model="request.social_platform_id"
                    density="compact"
                    variant="outlined"
                    hide-details="auto"
                    class="mb-6"
                  ></v-text-field>

                  <label class="d-block mb-2">Tags</label>
                  <v-text-field
                    v-model="request.tags"
                    density="compact"
                    variant="outlined"
                    hide-details="auto"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="3">
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
          </v-window-item>

          <v-window-item value="address">
            <CustomerAddressList v-if="customerIdNumber" :customer-id="customerIdNumber" />
          </v-window-item>
        </v-window>
      </template>
    </v-card>
  </section>
</template>
