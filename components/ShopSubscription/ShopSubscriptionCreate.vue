<script lang="ts" setup>
import { UseShopSubscriptionStore } from "@/stores/shopSubscription";
import { UseShopStore } from "@/stores/shop";
import { UseSubscriptionPlanStore } from "@/stores/subscriptionPlan";

const store = UseShopSubscriptionStore();
const shopStore = UseShopStore();
const planStore = UseSubscriptionPlanStore();
const permission = UsePagePermission();
const loading = computed(() => store.loading);
const form = ref();
const shopOptionsLoading = computed(() => shopStore.shop_options_loading);
const planOptionsLoading = computed(() => planStore.plan_options_loading);

const request = ref({
  shop_id: null as number | null,
  plan_id: null as number | null,
  start_date: "",
  end_date: "",
});

onMounted(() => {
  shopStore.GetShopOptions();
  planStore.GetPlanOptions();
});

const submitForm = async () => {
  const { valid } = await form.value.validate();
  if (!valid) return;

  await store.CreateData({
    shop_id: request.value.shop_id as number,
    plan_id: request.value.plan_id as number,
    start_date: request.value.start_date,
    end_date: request.value.end_date || undefined,
  });
};
</script>

<template>
  <section class="pa-6">
    <v-card elevation="0" class="pa-6">
      <GlobalTextTitleLine title="ເພີ່ມການສະໝັກໃຊ້ງານຮ້ານຄ້າ" class="mb-8">
        <template v-if="permission.can_create" #actions>
          <v-btn color="primary" flat type="submit" form="shop-subscription-create-form" :loading="loading"
            >ບັນທຶກ</v-btn
          >
        </template>
      </GlobalTextTitleLine>

      <GlobalPermissionDenied v-if="!permission.can_create" />

      <v-form v-else id="shop-subscription-create-form" ref="form" @submit.prevent="submitForm">
        <v-row>
          <v-col cols="12" md="6">
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

            <label class="d-block mb-2">ແພັກເກັດ / Plan</label>
            <v-autocomplete
              v-model.number="request.plan_id"
              :items="planStore.plan_options"
              :loading="planOptionsLoading"
              item-title="plan_name"
              item-value="id"
              :rules="[(v: number) => !!v || 'ກະລຸນາເລືອກແພັກເກັດ']"
              density="compact"
              variant="outlined"
              hide-details="auto"
            ></v-autocomplete>
          </v-col>

          <v-col cols="12" md="6">
            <label class="d-block mb-2">ວັນເລີ່ມ / Start date</label>
            <v-text-field
              v-model="request.start_date"
              type="date"
              :rules="[(v: string) => !!v || 'ກະລຸນາເລືອກວັນເລີ່ມ']"
              density="compact"
              variant="outlined"
              hide-details="auto"
              class="mb-6"
            ></v-text-field>

            <label class="d-block mb-2">ວັນໝົດ / End date</label>
            <v-text-field
              v-model="request.end_date"
              type="date"
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
