<script lang="ts" setup>
import axios from "@/helpers/axios";
import { UseOrderItemStore } from "@/stores/orderItem";

const props = defineProps<{ orderId: number }>();

const store = UseOrderItemStore();
const variantLabels = ref<Record<number, string>>({});

const response = computed(() => store.response_query_data);

onMounted(async () => {
  store.request_query_data.order_id = props.orderId;
  await store.GetListData();
  await resolveVariantLabels();
});

// order_item ບໍ່ມີຊື່ variant ຕິດມານຳ (ມີແຕ່ product_variant_id) — resolve ຊື່ແຍກຕ່າງຫາກ
async function resolveVariantLabels() {
  const items = response.value?.list_data ?? [];
  const uniqueIds = [...new Set(items.map((i) => i.product_variant_id))];
  for (const id of uniqueIds) {
    if (variantLabels.value[id]) continue;
    try {
      const res = await axios.get("/api/v1/product-variant/variant", { params: { id } });
      const variant = res.data?.items?.[0];
      variantLabels.value[id] = variant ? `${variant.variant_name} (${variant.sku_code})` : `#${id}`;
    } catch {
      variantLabels.value[id] = `#${id}`;
    }
  }
}

const headers = ref([
  { title: "ສິນຄ້າ", key: "product_variant_id", sortable: false },
  { title: "ຈຳນວນ", key: "buy_quantity", sortable: false },
  { title: "ລາຄາ/ໜ່ວຍ", key: "price_snapshot", sortable: false },
  { title: "ລວມ", key: "subtotal", sortable: false },
]);

const formatNumber = (num: number) => new Intl.NumberFormat().format(num);
</script>

<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="response?.list_data ?? []"
      :loading="store.request_query_data.loading"
      mobile-breakpoint="sm"
    >
      <template v-slot:item.product_variant_id="{ item }">
        {{ variantLabels[item.product_variant_id] ?? "..." }}
      </template>

      <template v-slot:item.price_snapshot="{ item }">
        {{ formatNumber(item.price_snapshot) }}
      </template>

      <template v-slot:item.subtotal="{ item }">
        {{ formatNumber(item.subtotal) }}
      </template>

      <template v-slot:no-data>
        <div class="text-center py-8 text-grey">ບໍ່ມີລາຍການສິນຄ້າ</div>
      </template>
    </v-data-table>
  </div>
</template>
