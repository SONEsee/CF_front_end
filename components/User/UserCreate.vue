<script lang="ts" setup>
import { UserStore } from "@/stores/user";

const userStore = UserStore();
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

const submitForm = async () => {
  const { valid } = await form.value.validate();
  if (!valid) return;

  await userStore.CreateData({
    shop_id: request.value.shop_id,
    role_id: request.value.role_id as number,
    username: request.value.username,
    password: request.value.password,
    full_name: request.value.full_name,
    email: request.value.email || undefined,
    phone: request.value.phone || undefined,
  });
};
</script>

<template>
  <section class="pa-6">
    <v-card elevation="0" class="pa-6">
      <GlobalTextTitleLine :title="title" class="mb-8">
        <template #actions>
          <v-btn color="primary" flat type="submit" form="user-create-form" :loading="loading"
            >ບັນທຶກ</v-btn
          >
        </template>
      </GlobalTextTitleLine>

      <v-form id="user-create-form" ref="form" @submit.prevent="submitForm">
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
