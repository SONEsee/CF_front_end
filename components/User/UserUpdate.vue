<script lang="ts" setup>
import { useRoute } from "vue-router";
import { UserStore } from "@/stores/user";
import { UseRoleStore } from "@/stores/role";
import { UseShopStore } from "@/stores/shop";

const route = useRoute();
const userStore = UserStore();
const roleStore = UseRoleStore();
const shopStore = UseShopStore();
const permission = UsePagePermission();
const title = ref("ແກ້ໄຂຜູ້ໃຊ້ງານ");
const loading = computed(() => userStore.loading);
const form = ref();

const userId = computed(() => route.query.id as string);

const API_BASE_URL = import.meta.env.VITE_BASE_URL ?? "";

function getAvatarUrl(profileImage: string | null | undefined) {
  if (!profileImage) return null;
  if (profileImage.startsWith("http")) return profileImage;
  return `${API_BASE_URL}${profileImage}`;
}

const request = ref({
  shop_id: null as number | null,
  role_id: null as number | null,
  username: "",
  password: "", // ຖ້າບໍ່ປ້ອນ = ບໍ່ປ່ຽນລະຫັດຜ່ານ
  full_name: "",
  email: "",
  phone: "",
});

// ---- Role & Shop dropdown options ----
const roleOptions = computed(
  () =>
    roleStore.response_query_data?.list_data.map((r) => ({
      title: r.role_name,
      value: r.id,
    })) ?? []
);

const shopOptions = computed(
  () =>
    shopStore.response_query_data?.list_data.map((s) => ({
      title: s.shop_name,
      value: s.id,
    })) ?? []
);

// ---- Profile image state ----
const fileInput = ref<HTMLInputElement | null>(null);
const avatarFile = ref<File | null>(null);
const avatarPreview = ref<string | null>(null);
const avatarError = ref<string | null>(null);
const existingAvatarUrl = ref<string | null>(null);
const removeExistingAvatar = ref(false); // flag ບອກ backend ວ່າຢາກລຶບຮູບເກົ່າ (ບໍ່ອັບໂຫຼດໃໝ່)

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const openFilePicker = () => {
  fileInput.value?.click();
};

const onAvatarChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  avatarError.value = null;

  if (!file) return;

  if (!ALLOWED_TYPES.includes(file.type)) {
    avatarError.value = "ອະນຸຍາດສະເພາະໄຟລ໌ຮູບພາບ (JPG, PNG, WEBP)";
    target.value = "";
    return;
  }

  if (file.size > MAX_FILE_SIZE) {
    avatarError.value = "ຂະໜາດໄຟລ໌ຕ້ອງບໍ່ເກີນ 2MB";
    target.value = "";
    return;
  }

  // ລ້າງ preview ເກົ່າ ກັນ memory leak
  if (avatarPreview.value) {
    URL.revokeObjectURL(avatarPreview.value);
  }

  avatarFile.value = file;
  avatarPreview.value = URL.createObjectURL(file);
  removeExistingAvatar.value = false;
};

const removeAvatar = () => {
  if (avatarPreview.value) {
    URL.revokeObjectURL(avatarPreview.value);
  }
  avatarFile.value = null;
  avatarPreview.value = null;
  avatarError.value = null;
  if (fileInput.value) fileInput.value.value = "";

  // ຖ້າກຳລັງລຶບຮູບເກົ່າທີ່ມີຢູ່ (ບໍ່ແມ່ນຮູບທີ່ຫາກໍ່ເລືອກ) ໃຫ້ຕັ້ງ flag ໄປບອກ backend
  if (existingAvatarUrl.value) {
    removeExistingAvatar.value = true;
    existingAvatarUrl.value = null;
  }
};

const displayAvatar = computed(() => avatarPreview.value ?? existingAvatarUrl.value);

const loadUserDetail = async () => {
  if (!userId.value) return;
  await userStore.GetDetailData(userId.value);
  const detail = userStore.response_detail_query_data as any;
  if (!detail) return;

  request.value.shop_id = detail.shop_id ?? null;
  request.value.role_id = detail.role_id ?? null;
  request.value.username = detail.username ?? "";
  request.value.full_name = detail.full_name ?? "";
  request.value.email = detail.email ?? "";
  request.value.phone = detail.phone ?? "";
  request.value.password = "";

  existingAvatarUrl.value = getAvatarUrl(detail.profile_image);
  removeExistingAvatar.value = false;
};

onMounted(async () => {
  // ໂຫລດຂໍ້ມູນ role & shop ສຳລັບ dropdown, ພ້ອມກັບຂໍ້ມູນຜູ້ໃຊ້ງານ
  await Promise.all([roleStore.GetListData(), shopStore.GetListData(), loadUserDetail()]);
});

const submitForm = async () => {
  const { valid } = await form.value.validate();
  if (!valid) return;
  if (avatarError.value) return;

  const formData = new FormData();
  formData.append("username", request.value.username);
  formData.append("full_name", request.value.full_name);
  formData.append("role_id", String(request.value.role_id));

  if (request.value.password) {
    formData.append("password", request.value.password);
  }
  if (request.value.shop_id !== null) {
    formData.append("shop_id", String(request.value.shop_id));
  }
  if (request.value.email) formData.append("email", request.value.email);
  if (request.value.phone) formData.append("phone", request.value.phone);

  if (avatarFile.value) {
    formData.append("profile_image", avatarFile.value);
  } else if (removeExistingAvatar.value) {
    formData.append("remove_profile_image", "1");
  }

  await userStore.UpdateData(userId.value, formData);
};
</script>

<template>
  <section class="pa-6">
    <v-card elevation="0" class="pa-6">
      <GlobalTextTitleLine :title="title" class="mb-8">
        <template v-if="permission.can_update" #actions>
          <v-btn color="primary" flat type="submit" form="user-update-form" :loading="loading"
            >ບັນທຶກ</v-btn
          >
        </template>
      </GlobalTextTitleLine>

      <GlobalPermissionDenied v-if="!permission.can_update" />

      <v-form v-else id="user-update-form" ref="form" @submit.prevent="submitForm">
        <!-- ==== Profile Image Upload ==== -->
        <v-row class="mb-2">
          <v-col cols="12" class="d-flex align-center">
            <div class="position-relative" style="width: 96px">
              <v-avatar size="96" color="grey-lighten-2" class="cursor-pointer" @click="openFilePicker">
                <v-img v-if="displayAvatar" :src="displayAvatar" cover />
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
                  v-if="displayAvatar"
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
          <v-col cols="12" md="4">
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

            <label class="d-block mb-2">ລະຫັດຜ່ານໃໝ່ / New Password</label>
            <v-text-field
              v-model="request.password"
              type="password"
              placeholder="ປະໄວ້ຖ້າບໍ່ຕ້ອງການປ່ຽນລະຫັດຜ່ານ"
              density="compact"
              variant="outlined"
              hide-details="auto"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="4">
            <label class="d-block mb-2">ບົດບາດ / Role</label>
            <v-select
              v-model="request.role_id"
              :items="roleOptions"
              item-title="title"
              item-value="value"
              :loading="roleStore.loading"
              :rules="[(v: number) => !!v || 'ກະລຸນາເລືອກບົດບາດ']"
              placeholder="ກະລຸນາເລືອກບົດບາດ"
              density="compact"
              variant="outlined"
              hide-details="auto"
              class="mb-6"
              clearable
            ></v-select>

            <label class="d-block mb-2">ຮ້ານຄ້າ / Shop (ບໍ່ບັງຄັບ)</label>
            <v-select
              v-model="request.shop_id"
              :items="shopOptions"
              item-title="title"
              item-value="value"
              :loading="shopStore.loading"
              placeholder="ກະລຸນາເລືອກຮ້ານຄ້າ (ຖ້າມີ)"
              density="compact"
              variant="outlined"
              hide-details="auto"
              clearable
            ></v-select>
          </v-col>

          <v-col cols="12" md="4">
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