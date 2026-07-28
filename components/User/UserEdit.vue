<script lang="ts" setup>
import { useRoute } from "vue-router";
import { UserStore } from "@/stores/user";
import { UseUploadStore } from "@/stores/upload";
import { UseShopStore } from "@/stores/shop";
import { UseRoleStore } from "@/stores/role";
import notfoundImage from "@/assets/img/404.png";

const route = useRoute();
const id = route.query.id as string;
const userStore = UserStore();
const uploadStore = UseUploadStore();
const shopStore = UseShopStore();
const roleStore = UseRoleStore();
const permission = UsePagePermission();
const loading = computed(() => userStore.loading || uploadStore.loading);
const form = ref();
const file = ref();
const selectedFile = ref<File | null>(null);
const existingProfileImage = ref<string | null>(null);
const shopOptionsLoading = computed(() => shopStore.shop_options_loading);
const roleOptionsLoading = computed(() => roleStore.role_options_loading);

const request = ref({
  shop_id: null as number | null,
  role_id: null as number | null,
  username: "",
  password: "",
  full_name: "",
  email: "",
  phone: "",
});

const previewImage = computed(() => {
  if (selectedFile.value) return GetImageUrl(selectedFile.value);
  return existingProfileImage.value ?? notfoundImage;
});

onMounted(async () => {
  shopStore.GetShopOptions();
  roleStore.GetRoleOptions();

  await userStore.GetDetailData(id);
  const user = userStore.response_detail_query_data;
  if (user) {
    request.value.shop_id = user.shop_id;
    request.value.role_id = user.role_id;
    request.value.username = user.username;
    request.value.full_name = user.full_name;
    request.value.email = user.email;
    request.value.phone = user.phone;
    existingProfileImage.value = user.profile_image;
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

  let profileImage = existingProfileImage.value ?? undefined;
  if (selectedFile.value) {
    const uploadedUrl = await uploadStore.UploadImage(selectedFile.value, "user");
    if (!uploadedUrl) return;
    profileImage = uploadedUrl;
  }

  await userStore.UpdateData(id, {
    shop_id: request.value.shop_id,
    role_id: request.value.role_id,
    username: request.value.username,
    password: request.value.password || undefined,
    full_name: request.value.full_name,
    email: request.value.email || undefined,
    phone: request.value.phone || undefined,
    profile_image: profileImage,
  });
};
</script>

<template>
  <section class="pa-6">
    <v-card elevation="0" class="pa-6">
      <GlobalTextTitleLine title="ແກ້ໄຂຜູ້ໃຊ້ງານ" class="mb-8">
        <template v-if="permission.can_update" #actions>
          <v-btn color="primary" flat type="submit" form="user-edit-form" :loading="loading"
            >ບັນທຶກ</v-btn
          >
        </template>
      </GlobalTextTitleLine>

      <GlobalPermissionDenied v-if="!permission.can_update" />

      <v-form v-else id="user-edit-form" ref="form" @submit.prevent="submitForm">
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
                  text="ອັບໂຫຼດຮູບໂປຣໄຟລ໌"
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
            <label class="d-block mb-2">ຊື່ ແລະ ນາມສະກຸນ / Full name</label>
            <v-text-field
              v-model="request.full_name"
              :rules="[(v: string) => !!v || 'ກະລຸນາປ້ອນຊື່ ແລະ ນາມສະກຸນ']"
              density="compact"
              variant="outlined"
              hide-details="auto"
              class="mb-6"
            ></v-text-field>

            <label class="d-block mb-2">ຊື່ຜູ້ໃຊ້ງານ / Username</label>
            <v-text-field
              v-model="request.username"
              :rules="[(v: string) => !!v || 'ກະລຸນາປ້ອນຊື່ຜູ້ໃຊ້ງານ']"
              density="compact"
              variant="outlined"
              hide-details="auto"
              class="mb-6"
            ></v-text-field>

            <label class="d-block mb-2">ລະຫັດຜ່ານໃໝ່ / New password</label>
            <v-text-field
              v-model="request.password"
              type="password"
              placeholder="ປະໄວ້ຫວ່າງຖ້າບໍ່ປ່ຽນລະຫັດຜ່ານ"
              density="compact"
              variant="outlined"
              hide-details="auto"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="3">
            <label class="d-block mb-2">Role</label>
            <v-autocomplete
              :items="roleStore.role_options"
              :loading="roleOptionsLoading"
              v-model.number="request.role_id"
              item-title="role_name"
              item-value="id"
              :rules="[(v: number) => !!v || 'ກະລຸນາເລືອກ Role']"
              placeholder="ກະລຸນາເລືອກ Role"
              density="compact"
              variant="outlined"
              hide-details="auto"
              class="mb-6"
            ></v-autocomplete>

            <label class="d-block mb-2">ຮ້ານຄ້າ</label>
            <v-autocomplete
              :items="shopStore.shop_options"
              :loading="shopOptionsLoading"
              v-model.number="request.shop_id"
              item-title="shop_name"
              item-value="id"
              clearable
              placeholder="ກະລຸນາເລືອກຮ້ານຄ້າ (ຖ້າມີ)"
              density="compact"
              variant="outlined"
              hide-details="auto"
            ></v-autocomplete>
          </v-col>

          <v-col cols="12" md="3">
            <label class="d-block mb-2">ອີເມວ / Email</label>
            <v-text-field
              v-model="request.email"
              density="compact"
              variant="outlined"
              hide-details="auto"
              class="mb-6"
            ></v-text-field>

            <label class="d-block mb-2">ເບີໂທລະສັບ / Phone</label>
            <v-text-field
              v-model="request.phone"
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
