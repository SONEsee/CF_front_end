<script lang="ts" setup>
import { useRoute } from "vue-router";
import { UseShopBankAccountStore } from "@/stores/shopbankaccount";

const route = useRoute();
const id = route.query.id as string;
const store = UseShopBankAccountStore();
const loading = computed(() => store.loading);
const form = ref();

const request = ref({
  bank_name: "",
  account_number: "",
  account_name: "",
  promptpay_id: "",
  is_active: true,
});

onMounted(async () => {
  await store.GetDetailData(id);
  const account = store.response_detail_query_data;
  if (account) {
    request.value.bank_name = account.bank_name;
    request.value.account_number = account.account_number;
    request.value.account_name = account.account_name;
    request.value.promptpay_id = account.promptpay_id;
    request.value.is_active = account.is_active;
  }
});

const submitForm = async () => {
  const { valid } = await form.value.validate();
  if (!valid) return;

  await store.UpdateData(id, { ...request.value });
};
</script>

<template>
  <section class="pa-6">
    <v-card elevation="0" class="pa-6">
      <GlobalTextTitleLine title="ແກ້ໄຂບັນຊີທະນາຄານ" class="mb-8">
        <template #actions>
          <v-btn color="primary" flat type="submit" form="shop-bank-account-edit-form" :loading="loading"
            >ບັນທຶກ</v-btn
          >
        </template>
      </GlobalTextTitleLine>

      <v-form id="shop-bank-account-edit-form" ref="form" @submit.prevent="submitForm">
        <v-row>
          <v-col cols="12" md="4">
            <label class="d-block mb-2">ຊື່ທະນາຄານ / Bank name</label>
            <v-text-field
              v-model="request.bank_name"
              :rules="[(v: string) => !!v || 'ກະລຸນາປ້ອນຊື່ທະນາຄານ']"
              density="compact"
              variant="outlined"
              hide-details="auto"
              class="mb-6"
            ></v-text-field>

            <label class="d-block mb-2">ເລກບັນຊີ / Account number</label>
            <v-text-field
              v-model="request.account_number"
              :rules="[(v: string) => !!v || 'ກະລຸນາປ້ອນເລກບັນຊີ']"
              density="compact"
              variant="outlined"
              hide-details="auto"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="4">
            <label class="d-block mb-2">ຊື່ບັນຊີ / Account name</label>
            <v-text-field
              v-model="request.account_name"
              :rules="[(v: string) => !!v || 'ກະລຸນາປ້ອນຊື່ບັນຊີ']"
              density="compact"
              variant="outlined"
              hide-details="auto"
              class="mb-6"
            ></v-text-field>

            <label class="d-block mb-2">Promptpay ID</label>
            <v-text-field
              v-model="request.promptpay_id"
              density="compact"
              variant="outlined"
              hide-details="auto"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="4">
            <v-switch v-model="request.is_active" label="ເປີດໃຊ້ງານ" color="primary"></v-switch>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
  </section>
</template>
