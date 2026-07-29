<script lang="ts" setup>
import { useRoute } from "vue-router";
import { UseDiscountStore } from "@/stores/discount";

const route = useRoute();
const id = route.query.id as string;
const store = UseDiscountStore();
const permission = UsePagePermission();
const { shopName } = UseShopNameResolver();
const loading = computed(() => store.loading);
const form = ref();

const shopId = ref<number | null>(null);
const code = ref("");
const discountType = ref("");

const request = ref({
  discount_value: 0,
  min_order: 0,
  usage_limit: null as number | null,
  start_at: "",
  end_at: "",
});

onMounted(async () => {
  await store.GetDetailData(id);
  const discount = store.response_detail_query_data;
  if (discount) {
    shopId.value = discount.shop_id;
    code.value = discount.code;
    discountType.value = discount.discount_type;
    request.value.discount_value = discount.discount_value;
    request.value.min_order = discount.min_order;
    request.value.usage_limit = discount.usage_limit;
    request.value.start_at = discount.start_at ? discount.start_at.slice(0, 10) : "";
    request.value.end_at = discount.end_at ? discount.end_at.slice(0, 10) : "";
  }
});

const submitForm = async () => {
  const { valid } = await form.value.validate();
  if (!valid) return;

  await store.UpdateData(id, {
    discount_value: request.value.discount_value,
    min_order: request.value.min_order,
    usage_limit: request.value.usage_limit || undefined,
    start_at: request.value.start_at || undefined,
    end_at: request.value.end_at || undefined,
  });
};
</script>

<template>
  <section class="pa-6">
    <v-card elevation="0" class="pa-6">
      <GlobalTextTitleLine title="ແກ້ໄຂສ່ວນຫຼຸດ" class="mb-8">
        <template v-if="permission.can_update" #actions>
          <v-btn color="primary" flat type="submit" form="discount-edit-form" :loading="loading"
            >ບັນທຶກ</v-btn
          >
        </template>
      </GlobalTextTitleLine>

      <GlobalPermissionDenied v-if="!permission.can_update" />

      <v-form v-else id="discount-edit-form" ref="form" @submit.prevent="submitForm">
        <v-row>
          <v-col cols="12" md="6">
            <label class="d-block mb-2 text-grey">ຮ້ານຄ້າ / Shop</label>
            <div class="text-body-1 mb-4">{{ shopName(shopId) }}</div>

            <label class="d-block mb-2 text-grey">ລະຫັດສ່ວນຫຼຸດ / Code</label>
            <div class="text-body-1 mb-4">{{ code }} ({{ discountType }})</div>
          </v-col>

          <v-col cols="12" md="6">
            <label class="d-block mb-2">ມູນຄ່າ / Value</label>
            <v-text-field
              v-model.number="request.discount_value"
              type="number"
              :rules="[(v: number) => v > 0 || 'ຕ້ອງຫຼາຍກວ່າ 0']"
              density="compact"
              variant="outlined"
              hide-details="auto"
              class="mb-6"
            ></v-text-field>

            <label class="d-block mb-2">ຍອດຊື້ຂັ້ນຕ່ຳ / Min order</label>
            <v-text-field
              v-model.number="request.min_order"
              type="number"
              density="compact"
              variant="outlined"
              hide-details="auto"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="4">
            <label class="d-block mb-2">ຈຳກັດຈຳນວນຄັ້ງ / Usage limit</label>
            <v-text-field
              v-model.number="request.usage_limit"
              type="number"
              placeholder="ບໍ່ຈຳກັດ"
              density="compact"
              variant="outlined"
              hide-details="auto"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="4">
            <label class="d-block mb-2">ວັນເລີ່ມ / Start date</label>
            <v-text-field
              v-model="request.start_at"
              type="date"
              density="compact"
              variant="outlined"
              hide-details="auto"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="4">
            <label class="d-block mb-2">ວັນໝົດ / End date</label>
            <v-text-field
              v-model="request.end_at"
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
