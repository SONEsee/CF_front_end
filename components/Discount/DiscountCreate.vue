<script lang="ts" setup>
import { UseDiscountStore } from "@/stores/discount";
import { UseShopStore } from "@/stores/shop";

const store = UseDiscountStore();
const shopStore = UseShopStore();
const permission = UsePagePermission();
const loading = computed(() => store.loading);
const form = ref();
const shopOptionsLoading = computed(() => shopStore.shop_options_loading);

const request = ref({
  shop_id: null as number | null,
  code: "",
  discount_type: "PERCENT" as "PERCENT" | "FIXED",
  discount_value: 0,
  min_order: 0,
  usage_limit: null as number | null,
  start_at: "",
  end_at: "",
});

onMounted(() => {
  shopStore.GetShopOptions();
});

const submitForm = async () => {
  const { valid } = await form.value.validate();
  if (!valid) return;

  await store.CreateData({
    shop_id: request.value.shop_id as number,
    code: request.value.code,
    discount_type: request.value.discount_type,
    discount_value: request.value.discount_value,
    min_order: request.value.min_order || undefined,
    usage_limit: request.value.usage_limit || undefined,
    start_at: request.value.start_at || undefined,
    end_at: request.value.end_at || undefined,
  });
};
</script>

<template>
  <section class="pa-6">
    <v-card elevation="0" class="pa-6">
      <GlobalTextTitleLine title="ເພີ່ມສ່ວນຫຼຸດ" class="mb-8">
        <template v-if="permission.can_create" #actions>
          <v-btn color="primary" flat type="submit" form="discount-create-form" :loading="loading"
            >ບັນທຶກ</v-btn
          >
        </template>
      </GlobalTextTitleLine>

      <GlobalPermissionDenied v-if="!permission.can_create" />

      <v-form v-else id="discount-create-form" ref="form" @submit.prevent="submitForm">
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

            <label class="d-block mb-2">ລະຫັດສ່ວນຫຼຸດ / Code</label>
            <v-text-field
              v-model="request.code"
              :rules="[(v: string) => !!v || 'ກະລຸນາປ້ອນລະຫັດ']"
              density="compact"
              variant="outlined"
              hide-details="auto"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <label class="d-block mb-2">ປະເພດສ່ວນຫຼຸດ / Type</label>
            <v-select
              v-model="request.discount_type"
              :items="[
                { title: 'ເປີເຊັນ (%)', value: 'PERCENT' },
                { title: 'ຄົງທີ່ (ກີບ)', value: 'FIXED' },
              ]"
              density="compact"
              variant="outlined"
              hide-details="auto"
              class="mb-6"
            ></v-select>

            <label class="d-block mb-2">ມູນຄ່າ / Value</label>
            <v-text-field
              v-model.number="request.discount_value"
              type="number"
              :rules="[(v: number) => v > 0 || 'ຕ້ອງຫຼາຍກວ່າ 0']"
              density="compact"
              variant="outlined"
              hide-details="auto"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="4">
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
          </v-col>

          <v-col cols="12" md="6">
            <label class="d-block mb-2">ວັນເລີ່ມ / Start date</label>
            <v-text-field
              v-model="request.start_at"
              type="date"
              density="compact"
              variant="outlined"
              hide-details="auto"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
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
