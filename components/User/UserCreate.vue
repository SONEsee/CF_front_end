<script lang="ts" setup>
import { UserStore } from "@/stores/user";
import { UseShopStore } from "@/stores/shop";
import { UseRoleStore } from "@/stores/role";
import notfoundImage from "@/assets/img/404.png";

const userStore = UserStore();
const shopStore = UseShopStore();
const roleStore = UseRoleStore();
const permission = UsePagePermission();
const title = ref("ເພີ່ມຜູ້ໃຊ້ງານ");
const loading = computed(() => userStore.loading);
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

  const formData = new FormData();
  formData.append("username", request.value.username);
  formData.append("password", request.value.password);
  formData.append("full_name", request.value.full_name);
  if (request.value.role_id !== null) {
    formData.append("role_id", String(request.value.role_id));
  }
  if (request.value.shop_id !== null) {
    formData.append("shop_id", String(request.value.shop_id));
  }
  if (request.value.email) formData.append("email", request.value.email);
  if (request.value.phone) formData.append("phone", request.value.phone);
  if (selectedFile.value) {
    formData.append("profile_image", selectedFile.value);
  }

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