<script lang="ts" setup>
import { useRoute } from "vue-router";
import { UseShopSubscriptionStore } from "@/stores/shopSubscription";
import { UseSubscriptionPlanStore } from "@/stores/subscriptionPlan";

const route = useRoute();
const id = route.query.id as string;
const store = UseShopSubscriptionStore();
const planStore = UseSubscriptionPlanStore();
const permission = UsePagePermission();
const { shopName } = UseShopNameResolver();
const loading = computed(() => store.loading);
const planOptionsLoading = computed(() => planStore.plan_options_loading);
const form = ref();

const shopId = ref<number | null>(null);
const startDate = ref("");
const request = ref({
  plan_id: null as number | null,
  end_date: "",
});

onMounted(async () => {
  planStore.GetPlanOptions();
  await store.GetDetailData(id);
  const subscription = store.response_detail_query_data;
  if (subscription) {
    shopId.value = subscription.shop_id;
    startDate.value = subscription.start_date;
    request.value.plan_id = subscription.plan_id;
    request.value.end_date = subscription.end_date ?? "";
  }
});

const submitForm = async () => {
  const { valid } = await form.value.validate();
  if (!valid) return;

  await store.UpdateData(id, {
    plan_id: request.value.plan_id as number,
    end_date: request.value.end_date || undefined,
  });
};
</script>

<template>
  <section class="pa-6">
    <v-card elevation="0" class="pa-6">
      <GlobalTextTitleLine title="ແກ້ໄຂການສະໝັກໃຊ້ງານຮ້ານຄ້າ" class="mb-8">
        <template v-if="permission.can_update" #actions>
          <v-btn color="primary" flat type="submit" form="shop-subscription-edit-form" :loading="loading"
            >ບັນທຶກ</v-btn
          >
        </template>
      </GlobalTextTitleLine>

      <GlobalPermissionDenied v-if="!permission.can_update" />

      <v-form v-else id="shop-subscription-edit-form" ref="form" @submit.prevent="submitForm">
        <v-row>
          <v-col cols="12" md="6">
            <label class="d-block mb-2 text-grey">ຮ້ານຄ້າ / Shop</label>
            <div class="text-body-1 mb-4">{{ shopName(shopId) }}</div>

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
            <label class="d-block mb-2 text-grey">ວັນເລີ່ມ / Start date</label>
            <div class="text-body-1 mb-4">{{ startDate }}</div>

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
