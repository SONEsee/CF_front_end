<script lang="ts" setup>
import { UserStore } from "@/stores/user";

const userStore = UserStore();
const permission = UsePagePermission();
const title = ref("ເພີ່ມຜູ້ໃຊ້ງານ");
const loading = computed(() => userStore.loading);
const form = ref();

const request = ref({
  shop_id: null as number | null,
  role_id: null as number | null,
  username: "",
  password: "",
  full_name: "",
  email: "",
  phone: "",
});

// ---- Profile image state ----
const fileInput = ref<HTMLInputElement | null>(null);
const avatarFile = ref<File | null>(null);
const avatarPreview = ref<string | null>(null);
const avatarError = ref<string | null>(null);

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
};

const removeAvatar = () => {
  if (avatarPreview.value) {
    URL.revokeObjectURL(avatarPreview.value);
  }
  avatarFile.value = null;
  avatarPreview.value = null;
  avatarError.value = null;
  if (fileInput.value) fileInput.value.value = "";
};

const submitForm = async () => {
  const { valid } = await form.value.validate();
  if (!valid) return;
  if (avatarError.value) return;

  const formData = new FormData();
  formData.append("username", request.value.username);
  formData.append("password", request.value.password);
  formData.append("full_name", request.value.full_name);
  formData.append("role_id", String(request.value.role_id));

  if (request.value.shop_id !== null) {
    formData.append("shop_id", String(request.value.shop_id));
  }
  if (request.value.email) formData.append("email", request.value.email);
  if (request.value.phone) formData.append("phone", request.value.phone);
  if (avatarFile.value) formData.append("profile_image", avatarFile.value);

  await userStore.CreateData(formData);
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

          <v-col cols="12" md="4">
            <label class="d-block mb-2">Role ID</label>
            <v-text-field
              v-model.number="request.role_id"
              type="number"
              :rules="[(v: number) => !!v || 'ກະລຸນາປ້ອນ Role ID']"
              placeholder="ກະລຸນາປ້ອນ Role ID"
              density="compact"
              variant="outlined"
              hide-details="auto"
              class="mb-6"
            ></v-text-field>

            <label class="d-block mb-2">Shop ID</label>
            <v-text-field
              v-model.number="request.shop_id"
              type="number"
              placeholder="ກະລຸນາປ້ອນ Shop ID (ຖ້າມີ)"
              density="compact"
              variant="outlined"
              hide-details="auto"
            ></v-text-field>
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