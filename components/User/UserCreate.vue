<script lang="ts" setup>
import { UserStore } from "@/stores/user";
import { UseUploadStore } from "@/stores/upload";
import { UseShopStore } from "@/stores/shop";
import { UseRoleStore } from "@/stores/role";
import notfoundImage from "@/assets/img/404.png";

const userStore = UserStore();
const uploadStore = UseUploadStore();
const shopStore = UseShopStore();
const roleStore = UseRoleStore();
const permission = UsePagePermission();
const title = ref("ເພີ່ມຜູ້ໃຊ້ງານ");
const loading = computed(() => userStore.loading || uploadStore.loading);
const form = ref();
const file = ref();
const selectedFile = ref<File | null>(null);
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

onMounted(() => {
  shopStore.GetShopOptions();
  roleStore.GetRoleOptions();
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
  if (avatarError.value) return;

  let profileImage: string | undefined;
  if (selectedFile.value) {
    const uploadedUrl = await uploadStore.UploadImage(selectedFile.value, "user");
    if (!uploadedUrl) return;
    profileImage = uploadedUrl;
  }

  await userStore.CreateData({
    shop_id: request.value.shop_id,
    role_id: request.value.role_id as number,
    username: request.value.username,
    password: request.value.password,
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
      <GlobalTextTitleLine :title="title" class="mb-8">
        <template v-if="permission.can_create" #actions>
          <v-btn color="primary" flat type="submit" form="user-create-form" :loading="loading"
            >ບັນທຶກ</v-btn
          >
        </template>
      </GlobalTextTitleLine>

      <GlobalPermissionDenied v-if="!permission.can_create" />

      <v-form v-else id="user-create-form" ref="form" @submit.prevent="submitForm">
        <!-- ==== Profile Image Upload ==== -->
        <v-row class="mb-2">
          <v-col cols="12" class="d-flex align-center">
            <div class="position-relative" style="width: 96px">
              <v-avatar size="96" color="grey-lighten-2" class="cursor-pointer" @click="openFilePicker">
                <v-img v-if="avatarPreview" :src="avatarPreview" cover />
                <v-icon v-else size="40" color="grey-darken-1">mdi-account</v-icon>
              </v-avatar>

              <v-btn
                icon
                size="x-small"
                color="primary"
                class="position-absolute"
                style="bottom: 0; right: 0"
                @click="openFilePicker"
              >
                <v-icon size="16">mdi-camera</v-icon>
              </v-btn>
            </div>

            <div class="ml-4">
              <div class="text-body-2 mb-1">ຮູບໂປຣໄຟລ໌ (ບໍ່ບັງຄັບ)</div>
              <div class="d-flex ga-2">
                <v-btn size="small" variant="outlined" @click="openFilePicker">ເລືອກຮູບ</v-btn>
                <v-btn
                  v-if="avatarPreview"
                  size="small"
                  variant="text"
                  color="error"
                  @click="removeAvatar"
                  >ລຶບຮູບ</v-btn
                >
              </div>
              <div v-if="avatarError" class="text-error text-caption mt-1">
                {{ avatarError }}
              </div>
              <div v-else class="text-caption text-grey mt-1">JPG, PNG, WEBP ຂະໜາດບໍ່ເກີນ 2MB</div>
            </div>

            <input
              ref="fileInput"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              class="d-none"
              @change="onAvatarChange"
            />
          </v-col>
        </v-row>

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
              placeholder="ກະລຸນາປ້ອນຊື່ ແລະ ນາມສະກຸນ"
              density="compact"
              variant="outlined"
              hide-details="auto"
              class="mb-6"
            ></v-text-field>

            <label class="d-block mb-2">ຊື່ຜູ້ໃຊ້ງານ / Username</label>
            <v-text-field
              v-model="request.username"
              :rules="[(v: string) => !!v || 'ກະລຸນາປ້ອນຊື່ຜູ້ໃຊ້ງານ']"
              placeholder="ກະລຸນາປ້ອນຊື່ຜູ້ໃຊ້ງານ"
              density="compact"
              variant="outlined"
              hide-details="auto"
              class="mb-6"
            ></v-text-field>

            <label class="d-block mb-2">ລະຫັດຜ່ານ / Password</label>
            <v-text-field
              v-model="request.password"
              type="password"
              :rules="[(v: string) => !!v || 'ກະລຸນາປ້ອນລະຫັດຜ່ານ']"
              placeholder="ກະລຸນາປ້ອນລະຫັດຜ່ານ"
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
              placeholder="ກະລຸນາປ້ອນອີເມວ"
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
        </v-row>
      </v-form>
    </v-card>
  </section>
</template>