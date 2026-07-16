<script lang="ts" setup>
import { UseShopStore } from "@/stores/shop";

const shopStore = UseShopStore();
const loading = computed(() => shopStore.loading);
const form = ref();

const request = ref({
  shop_name: "",
  owner_user_id: null as number | null,
  phone: "",
  timezone: "",
});

const submitForm = async () => {
  const { valid } = await form.value.validate();
  if (!valid) return;

  await shopStore.CreateData({
    shop_name: request.value.shop_name,
    owner_user_id: request.value.owner_user_id,
    phone: request.value.phone || undefined,
    timezone: request.value.timezone || undefined,
  });
};
</script>

<template>
  <section class="pa-6">
    <v-card elevation="0" class="pa-6">
      <GlobalTextTitleLine title="ເພີ່ມຮ້ານຄ້າ" class="mb-8">
        <template #actions>
          <v-btn color="primary" flat type="submit" form="shop-create-form" :loading="loading"
            >ບັນທຶກ</v-btn
          >
        </template>
      </GlobalTextTitleLine>

      <v-form id="shop-create-form" ref="form" @submit.prevent="submitForm">
        <v-row>
          <v-col cols="12" md="6">
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

          <v-col cols="12" md="6">
            <label class="d-block mb-2">Owner User ID</label>
            <v-text-field
              v-model.number="request.owner_user_id"
              type="number"
              placeholder="ກະລຸນາປ້ອນ Owner User ID (ຖ້າມີ)"
              density="compact"
              variant="outlined"
              hide-details="auto"
              class="mb-6"
            ></v-text-field>

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
