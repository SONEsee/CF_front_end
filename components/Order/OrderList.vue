<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { UseOrderStore } from "@/stores/order";
import { UseShopStore } from "@/stores/shop";

const router = useRouter();
const store = UseOrderStore();
const shopStore = UseShopStore();
const permission = UsePagePermission();
const { shopName } = UseShopNameResolver();

const response = computed(() => store.response_query_data);
const shopOptionsLoading = computed(() => shopStore.shop_options_loading);

const statusOptions = [
  { title: "UNPAID", value: "UNPAID" },
  { title: "PAYMENT_PENDING_VERIFY", value: "PAYMENT_PENDING_VERIFY" },
  { title: "PAID", value: "PAID" },
  { title: "PACKING", value: "PACKING" },
  { title: "SHIPPED", value: "SHIPPED" },
  { title: "CANCELLED", value: "CANCELLED" },
];

onMounted(async () => {
  shopStore.GetShopOptions();
  store.GetListData();
});

const request = store.request_query_data;

async function onSelectionChange(limit: number) {
  request.limit = limit;
  await store.GetListData();
}

async function onPageChange(page: number) {
  request.page = page;
  await store.GetListData();
}

async function onFilterChange() {
  request.page = 1;
  await store.GetListData();
}

const headers = ref([
  { title: "ເລກອໍເດີ", key: "order_number", sortable: false },
  { title: "ຮ້ານຄ້າ", key: "shop_id", sortable: false },
  { title: "ຍອດລວມ", key: "net_payable_amount", sortable: false },
  { title: "ສະຖານະ", key: "current_status", sortable: false },
  { title: "ວັນທີ່ສ້າງ", key: "created_at", sortable: false },
  { title: "Actions", key: "actions", sortable: false },
]);

const formatNumber = (num: number) => new Intl.NumberFormat().format(num);
const formatDate = (d: string) => new Date(d).toLocaleString();

const goPath = (path: string) => {
  router.push(path);
};

const onsetinput = async (input: string | null) => {
  request.q = input ?? null;
  request.page = 1;
  await store.GetListData();
};

const statusColor = (status: string) => {
  if (status === "UNPAID") return "warning";
  if (status === "PAYMENT_PENDING_VERIFY") return "secondary";
  if (status === "PAID" || status === "PACKING" || status === "SHIPPED") return "info";
  return "error";
};
</script>

<template>
  <div class="pa-6">
    <v-card elevation="0" tile width="100%" min-height="95vh" class="pa-6">
      <v-row>
        <v-col cols="12">
          <GlobalTextTitleLine
            :title="`ຈັດການອໍເດີ / Manage Order (${formatNumber(
              response?.pagination?.total_items ?? 0
            )})`"
          />
        </v-col>

        <v-col cols="12" class="d-flex flex-wrap justify-space-between align-center">
          <div class="d-flex flex-wrap ga-4 align-end">
            <div style="width: 240px">
              <GlobalDebounceEventTextField
                :input="request.q"
                :label="'ຄົ້ນຫາເລກອໍເດີ'"
                @setinput="onsetinput"
              />
            </div>

            <div style="width: 220px">
              <v-autocomplete
                v-model.number="request.shop_id"
                :items="shopStore.shop_options"
                :loading="shopOptionsLoading"
                item-title="shop_name"
                item-value="id"
                label="ຮ້ານຄ້າ"
                clearable
                density="compact"
                variant="outlined"
                hide-details
                @update:model-value="onFilterChange"
              ></v-autocomplete>
            </div>

            <div style="width: 220px">
              <v-select
                v-model="request.status"
                :items="statusOptions"
                label="ສະຖານະ"
                clearable
                density="compact"
                variant="outlined"
                hide-details
                @update:model-value="onFilterChange"
              ></v-select>
            </div>

            <div>
              <v-btn
                color="primary"
                flat
                :loading="request.loading"
                @click="store.GetListData()"
                >ຄົ້ນຫາ</v-btn
              >
            </div>
          </div>

          <div v-if="permission.can_create" class="d-flex flex-wrap align-center">
            <v-btn color="primary" elevation="0" @click="goPath('/order/create')">
              <v-icon class="mr-2"> mdi-plus</v-icon>
              ສ້າງອໍເດີ
            </v-btn>
          </div>
        </v-col>

        <v-col cols="12">
          <v-data-table
            :headers="headers"
            :items="response?.list_data ?? []"
            :loading="request.loading"
            mobile-breakpoint="sm"
          >
            <template v-slot:item.shop_id="{ item }">
              {{ shopName(item.shop_id) }}
            </template>

            <template v-slot:item.net_payable_amount="{ item }">
              {{ formatNumber(item.net_payable_amount) }}
            </template>

            <template v-slot:item.current_status="{ item }">
              <v-chip :color="statusColor(item.current_status)" size="small">{{ item.current_status }}</v-chip>
            </template>

            <template v-slot:item.created_at="{ item }">
              {{ formatDate(item.created_at) }}
            </template>

            <template v-slot:item.actions="{ item }">
              <v-btn
                v-if="permission.can_view"
                color="primary"
                icon="mdi-eye"
                variant="text"
                @click="goPath(`/order/detail?id=${item.id}`)"
                size="small"
              ></v-btn>
            </template>

            <template v-slot:bottom>
              <GlobalTablePaginations
                :page="request.page"
                :limit="request.limit"
                :totalpage="response?.pagination?.total_page ?? 1"
                @onSelectionChange="onSelectionChange"
                @onPagechange="onPageChange"
              />
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>
