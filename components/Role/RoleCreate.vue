<script lang="ts" setup>
import { UseRoleStore } from "@/stores/role";
const shopStore = UseShopStore();
const store = UseRoleStore();
const permission = UsePagePermission();
const loading = computed(() => store.loading);
const form = ref();

const request = ref({
  shop_id: null as number | null,
  role_name: "",
  description: "",
});


const shopOptionsLoading = computed(() => shopStore.shop_options_loading);
const submitForm = async () => {
  const { valid } = await form.value.validate();
  if (!valid) return;

  await store.CreateData({
    shop_id: request.value.shop_id,
    role_name: request.value.role_name,
    description: request.value.description || undefined,
  });
};
onMounted(() => {
  shopStore.GetShopOptions();
});
</script>

<template>
  <section class="pa-6">
    <v-card elevation="0" class="pa-6">
      <GlobalTextTitleLine title="ເພີ່ມສິດການນຳໃຊ້" class="mb-8">
        <template v-if="permission.can_create" #actions>
          <v-btn color="primary" flat type="submit" form="role-create-form" :loading="loading"
            >ບັນທຶກ</v-btn
          >
        </template>
      </GlobalTextTitleLine>

      <GlobalPermissionDenied v-if="!permission.can_create" />

      <v-form v-else id="role-create-form" ref="form" @submit.prevent="submitForm">
        <v-row>
          <v-col cols="12" md="6">
            <label class="d-block mb-2">ຊື່ສິດການນຳໃຊ້ / Role name</label>
            <v-text-field
              v-model="request.role_name"
              :rules="[(v: string) => !!v || 'ກະລຸນາປ້ອນຊື່ສິດການນຳໃຊ້']"
              density="compact"
              variant="outlined"
              hide-details="auto"
              class="mb-6"
            ></v-text-field>

            <label class="d-block mb-2">Shop ID</label>
            <v-autocomplete
              :items="shopStore.shop_options"
              :loading="shopOptionsLoading"
              v-model.number="request.shop_id"
              item-title="shop_name"
              item-value="id"
              clearable
              placeholder="ກະລຸນາເລືອກ Shop ID (ຖ້າມີ)"
              density="compact"
              variant="outlined"
              hide-details="auto"
            ></v-autocomplete>
          </v-col>

          <v-col cols="12" md="6">
            <label class="d-block mb-2">ລາຍລະອຽດ / Description</label>
            <v-textarea
              v-model="request.description"
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
