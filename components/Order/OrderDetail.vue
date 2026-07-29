<script lang="ts" setup>
import { useRoute } from "vue-router";
import { UseOrderStore } from "@/stores/order";
import type { OrderStatus } from "@/models/order";

const route = useRoute();
const orderId = computed(() => route.query.id as string);
const orderIdNumber = computed(() => Number(orderId.value));
const store = UseOrderStore();
const permission = UsePagePermission();
const { shopName } = UseShopNameResolver();

const detail = computed(() => store.response_detail_query_data);
const activeTab = ref("items");

// mirror ຂອງ orderTransitions ຝັ່ງ backend (order_status.go) — ໃຊ້ສະແດງປຸ່ມທີ່ຖືກຕ້ອງເທົ່ານັ້ນ,
// backend validate ອີກຊັ້ນຢູ່ແລ້ວ
const orderTransitions: Record<OrderStatus, OrderStatus[]> = {
  UNPAID: ["PAYMENT_PENDING_VERIFY", "CANCELLED"],
  PAYMENT_PENDING_VERIFY: ["PAID", "CANCELLED"],
  PAID: ["PACKING", "CANCELLED"],
  PACKING: ["SHIPPED"],
  SHIPPED: [],
  CANCELLED: [],
};

const availableTransitions = computed(() => (detail.value ? orderTransitions[detail.value.current_status] : []));

const goPath = (path: string) => {
  navigateTo(path);
};

onMounted(async () => {
  if (!orderId.value) return;
  await store.GetDetailData(orderId.value);
});

const changeStatus = async (status: OrderStatus) => {
  await store.UpdateStatus(orderId.value, status);
};

const statusColor = (status: string) => {
  if (status === "UNPAID") return "warning";
  if (status === "PAYMENT_PENDING_VERIFY") return "secondary";
  if (status === "PAID" || status === "PACKING" || status === "SHIPPED") return "info";
  return "error";
};

const formatNumber = (num: number) => new Intl.NumberFormat().format(num);
</script>

<template>
  <section class="pa-6">
    <v-card elevation="0" class="pa-6">
      <GlobalTextTitleLine title="ລາຍລະອຽດອໍເດີ" class="mb-8">
        <template #actions>
          <v-btn variant="outlined" @click="goPath('/order')">ກັບຄືນ</v-btn>
        </template>
      </GlobalTextTitleLine>

      <GlobalPermissionDenied v-if="!permission.can_view" />

      <template v-else-if="detail">
        <v-row class="mb-2">
          <v-col cols="12" md="8">
            <div class="text-h6 mb-2">{{ detail.order_number }}</div>
            <div class="d-flex flex-wrap ga-6">
              <div>
                <label class="d-block mb-1 text-grey">ຮ້ານຄ້າ</label>
                <div class="text-body-1">{{ shopName(detail.shop_id) }}</div>
              </div>
              <div>
                <label class="d-block mb-1 text-grey">ຍອດສິນຄ້າ</label>
                <div class="text-body-1">{{ formatNumber(detail.items_total_amount) }}</div>
              </div>
              <div>
                <label class="d-block mb-1 text-grey">ສ່ວນຫຼຸດ</label>
                <div class="text-body-1">{{ formatNumber(detail.discount_amount) }}</div>
              </div>
              <div>
                <label class="d-block mb-1 text-grey">ຄ່າສົ່ງ</label>
                <div class="text-body-1">{{ formatNumber(detail.shipping_fee) }}</div>
              </div>
              <div>
                <label class="d-block mb-1 text-grey">ຍອດສຸດທິ</label>
                <div class="text-h6">{{ formatNumber(detail.net_payable_amount) }}</div>
              </div>
            </div>
          </v-col>

          <v-col cols="12" md="4" class="d-flex flex-column align-md-end">
            <v-chip :color="statusColor(detail.current_status)" size="large" class="mb-4">
              {{ detail.current_status }}
            </v-chip>

            <div v-if="permission.can_update" class="d-flex flex-wrap ga-2 justify-end">
              <v-btn
                v-for="next in availableTransitions"
                :key="next"
                :color="next === 'CANCELLED' ? 'error' : 'primary'"
                variant="tonal"
                size="small"
                :loading="store.loading"
                @click="changeStatus(next)"
              >
                ປ່ຽນເປັນ {{ next }}
              </v-btn>
            </div>
          </v-col>

          <v-col cols="12" v-if="detail.note">
            <label class="d-block mb-1 text-grey">ໝາຍເຫດ</label>
            <div class="text-body-1">{{ detail.note }}</div>
          </v-col>
        </v-row>

        <v-tabs v-model="activeTab" class="mb-6">
          <v-tab value="items">ລາຍການສິນຄ້າ</v-tab>
          <v-tab value="payment">ການຊຳລະເງິນ</v-tab>
          <v-tab value="shipment">ການຈັດສົ່ງ</v-tab>
          <v-tab value="refund">ຄືນເງິນ</v-tab>
        </v-tabs>

        <v-window v-model="activeTab">
          <v-window-item value="items">
            <OrderItemList v-if="orderIdNumber" :order-id="orderIdNumber" />
          </v-window-item>

          <v-window-item value="payment">
            <PaymentList v-if="orderIdNumber" :order-id="orderIdNumber" :shop-id="detail.shop_id" />
          </v-window-item>

          <v-window-item value="shipment">
            <ShipmentList v-if="orderIdNumber" :order-id="orderIdNumber" />
          </v-window-item>

          <v-window-item value="refund">
            <RefundList v-if="orderIdNumber" :order-id="orderIdNumber" />
          </v-window-item>
        </v-window>
      </template>

      <v-row v-else>
        <v-col cols="12" class="text-center py-8 text-grey">
          <v-progress-circular v-if="store.loading" indeterminate color="primary" />
          <span v-else>ບໍ່ພົບຂໍ້ມູນອໍເດີ</span>
        </v-col>
      </v-row>
    </v-card>
  </section>
</template>
