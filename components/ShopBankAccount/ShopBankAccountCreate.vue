<script lang="ts" setup>
import { UseShopBankAccountStore } from "@/stores/shopbankaccount";
import { UseShopStore } from "@/stores/shop";

const store = UseShopBankAccountStore();
const shopStore = UseShopStore();
const permission = UsePagePermission();
const loading = computed(() => store.loading);
const form = ref();
const shopOptionsLoading = computed(() => shopStore.shop_options_loading);

const request = ref({
  shop_id: null as number | null,
  bank_name: "",
  account_number: "",
  account_name: "",
  promptpay_id: "",
});

onMounted(() => {
  shopStore.GetShopOptions();
});

const submitForm = async () => {
  const { valid } = await form.value.validate();
  if (!valid) return;

  await store.CreateData({
    shop_id: request.value.shop_id as number,
    bank_name: request.value.bank_name,
    account_number: request.value.account_number,
    account_name: request.value.account_name,
    promptpay_id: request.value.promptpay_id || undefined,
  });
};
</script>

<template>
  <section class="pa-6">
    <v-card elevation="0" class="pa-6">
      <GlobalTextTitleLine title="ເພີ່ມບັນຊີທະນາຄານ" class="mb-8">
        <template v-if="permission.can_create" #actions>
          <v-btn color="primary" flat type="submit" form="shop-bank-account-create-form" :loading="loading"
            >ບັນທຶກ</v-btn
          >
        </template>
      </GlobalTextTitleLine>

      <GlobalPermissionDenied v-if="!permission.can_create" />

      <v-form v-else id="shop-bank-account-create-form" ref="form" @submit.prevent="submitForm">
        <v-row>
          <v-col cols="12" md="4">
            <label class="d-block mb-2">ຮ້ານຄ້າ / Shop</label>
            <v-autocomplete
              v-model.number="request.shop_id"
              :items="shopStore.shop_options"
              :loading="shopOptionsLoading"
              item-title="shop_name"
              item-value="id"
              :rules="[(v: number) => !!v || 'ກະລຸນາເລືອກຮ້ານຄ້າ']"
              density="compact"
              variant="outlined"
              hide-details="auto"
              class="mb-6"
            ></v-autocomplete>

            <label class="d-block mb-2">ຊື່ທະນາຄານ / Bank name</label>
            <v-text-field
              v-model="request.bank_name"
              :rules="[(v: string) => !!v || 'ກະລຸນາປ້ອນຊື່ທະນາຄານ']"
              density="compact"
              variant="outlined"
              hide-details="auto"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="4">
            <label class="d-block mb-2">ເລກບັນຊີ / Account number</label>
            <v-text-field
              v-model="request.account_number"
              :rules="[(v: string) => !!v || 'ກະລຸນາປ້ອນເລກບັນຊີ']"
              density="compact"
              variant="outlined"
              hide-details="auto"
              class="mb-6"
            ></v-text-field>

            <label class="d-block mb-2">ຊື່ບັນຊີ / Account name</label>
            <v-text-field
              v-model="request.account_name"
              :rules="[(v: string) => !!v || 'ກະລຸນາປ້ອນຊື່ບັນຊີ']"
              density="compact"
              variant="outlined"
              hide-details="auto"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="4">
            <label class="d-block mb-2">Promptpay ID</label>
            <v-text-field
              v-model="request.promptpay_id"
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
