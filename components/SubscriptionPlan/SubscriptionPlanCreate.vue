<script lang="ts" setup>
import { UseSubscriptionPlanStore } from "@/stores/subscriptionPlan";

const store = UseSubscriptionPlanStore();
const permission = UsePagePermission();
const loading = computed(() => store.loading);
const form = ref();

const request = ref({
  plan_name: "",
  price_monthly: 0,
  max_users: 1,
  max_products: 100,
  features: "",
});

const featuresRule = (v: string) => {
  if (!v) return true;
  try {
    JSON.parse(v);
    return true;
  } catch {
    return "ຮູບແບບ JSON ບໍ່ຖືກຕ້ອງ";
  }
};

const submitForm = async () => {
  const { valid } = await form.value.validate();
  if (!valid) return;

  await store.CreateData({
    plan_name: request.value.plan_name,
    price_monthly: request.value.price_monthly,
    max_users: request.value.max_users,
    max_products: request.value.max_products,
    features: request.value.features || undefined,
  });
};
</script>

<template>
  <section class="pa-6">
    <v-card elevation="0" class="pa-6">
      <GlobalTextTitleLine title="ເພີ່ມແພັກເກັດຄ່າບໍລິການ" class="mb-8">
        <template v-if="permission.can_create" #actions>
          <v-btn color="primary" flat type="submit" form="subscription-plan-create-form" :loading="loading"
            >ບັນທຶກ</v-btn
          >
        </template>
      </GlobalTextTitleLine>

      <GlobalPermissionDenied v-if="!permission.can_create" />

      <v-form v-else id="subscription-plan-create-form" ref="form" @submit.prevent="submitForm">
        <v-row>
          <v-col cols="12" md="6">
            <label class="d-block mb-2">ຊື່ແພັກເກັດ / Plan name</label>
            <v-text-field
              v-model="request.plan_name"
              :rules="[(v: string) => !!v || 'ກະລຸນາປ້ອນຊື່ແພັກເກັດ']"
              density="compact"
              variant="outlined"
              hide-details="auto"
              class="mb-6"
            ></v-text-field>

            <label class="d-block mb-2">ລາຄາ/ເດືອນ / Price monthly</label>
            <v-text-field
              v-model.number="request.price_monthly"
              type="number"
              :rules="[(v: number) => v >= 0 || 'ລາຄາຕ້ອງບໍ່ຕິດລົບ']"
              density="compact"
              variant="outlined"
              hide-details="auto"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <label class="d-block mb-2">ຈຳນວນຜູ້ໃຊ້ສູງສຸດ / Max users</label>
            <v-text-field
              v-model.number="request.max_users"
              type="number"
              :rules="[(v: number) => v > 0 || 'ຕ້ອງຫຼາຍກວ່າ 0']"
              density="compact"
              variant="outlined"
              hide-details="auto"
              class="mb-6"
            ></v-text-field>

            <label class="d-block mb-2">ຈຳນວນສິນຄ້າສູງສຸດ / Max products</label>
            <v-text-field
              v-model.number="request.max_products"
              type="number"
              :rules="[(v: number) => v > 0 || 'ຕ້ອງຫຼາຍກວ່າ 0']"
              density="compact"
              variant="outlined"
              hide-details="auto"
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <label class="d-block mb-2">Features (JSON)</label>
            <v-textarea
              v-model="request.features"
              :rules="[featuresRule]"
              placeholder='{"live_selling": true}'
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
