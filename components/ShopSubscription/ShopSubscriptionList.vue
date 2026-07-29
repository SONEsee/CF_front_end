<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { UseShopSubscriptionStore } from "@/stores/shopSubscription";
import { UseShopStore } from "@/stores/shop";
import { UseSubscriptionPlanStore } from "@/stores/subscriptionPlan";

const router = useRouter();
const store = UseShopSubscriptionStore();
const shopStore = UseShopStore();
const planStore = UseSubscriptionPlanStore();
const permission = UsePagePermission();
const { shopName } = UseShopNameResolver();

const response = computed(() => store.response_query_data);
const shopOptionsLoading = computed(() => shopStore.shop_options_loading);

const planNameById = computed(() => {
  const map = new Map<number, string>();
  for (const plan of planStore.plan_options) {
    map.set(plan.id, plan.plan_name);
  }
  return map;
});
const planName = (planId: number) => planNameById.value.get(planId) ?? `#${planId}`;

onMounted(async () => {
  shopStore.GetShopOptions();
  planStore.GetPlanOptions();
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
  { title: "ລຳດັບ", key: "no", sortable: false },
  { title: "ຮ້ານຄ້າ", key: "shop_id", sortable: false },
  { title: "ແພັກເກັດ", key: "plan_id", sortable: false },
  { title: "ວັນເລີ່ມ", key: "start_date", sortable: false },
  { title: "ວັນໝົດ", key: "end_date", sortable: false },
  { title: "ສະຖານະ", key: "status", sortable: false },
  { title: "Actions", key: "actions", sortable: false },
]);

const formatNumber = (num: number) => new Intl.NumberFormat().format(num);

const goPath = (path: string) => {
  router.push(path);
};

const statusColor = (status: string) => {
  if (status === "ACTIVE") return "info";
  if (status === "EXPIRED") return "warning";
  return "error";
};
</script>

<template>
  <div class="pa-6">
    <v-card elevation="0" tile width="100%" min-height="95vh" class="pa-6">
      <v-row>
        <v-col cols="12">
          <GlobalTextTitleLine
            :title="`ການສະໝັກໃຊ້ງານຮ້ານຄ້າ / Shop Subscriptions (${formatNumber(
              response?.pagination?.total_items ?? 0
            )})`"
          />
        </v-col>

        <v-col cols="12" class="d-flex flex-wrap justify-space-between align-center">
          <div class="d-flex flex-wrap ga-4 align-end">
            <div style="width: 240px">
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
          </div>

          <div v-if="permission.can_create" class="d-flex flex-wrap align-center">
            <v-btn color="primary" elevation="0" @click="goPath('/shop-subscription/create')">
              <v-icon class="mr-2"> mdi-plus</v-icon>
              ເພີ່ມການສະໝັກໃຊ້ງານ
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
            <template v-slot:item.no="{ index }">
              {{ index + 1 }}
            </template>

            <template v-slot:item.shop_id="{ item }">
              {{ shopName(item.shop_id) }}
            </template>

            <template v-slot:item.plan_id="{ item }">
              {{ planName(item.plan_id) }}
            </template>

            <template v-slot:item.end_date="{ item }">
              {{ item.end_date ?? "-" }}
            </template>

            <template v-slot:item.status="{ item }">
              <v-chip :color="statusColor(item.status)" size="small">{{ item.status }}</v-chip>
            </template>

            <template v-slot:item.actions="{ item }">
              <v-btn
                v-if="permission.can_update"
                color="primary"
                icon="mdi-pencil"
                variant="text"
                @click="goPath(`/shop-subscription/edit?id=${item.id}`)"
                size="small"
              ></v-btn>

              <v-menu v-if="permission.can_update">
                <template v-slot:activator="{ props }">
                  <v-btn color="secondary" icon="mdi-dots-vertical" variant="text" size="small" v-bind="props"></v-btn>
                </template>
                <v-list>
                  <v-list-item @click="store.UpdateStatus(item.id, 'ACTIVE')">
                    <v-list-item-title>ຕັ້ງເປັນ ACTIVE</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="store.UpdateStatus(item.id, 'EXPIRED')">
                    <v-list-item-title>ຕັ້ງເປັນ EXPIRED</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="store.UpdateStatus(item.id, 'CANCELLED')">
                    <v-list-item-title>ຕັ້ງເປັນ CANCELLED</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
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
