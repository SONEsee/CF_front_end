<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { UseSubscriptionPlanStore } from "@/stores/subscriptionPlan";

const router = useRouter();
const store = UseSubscriptionPlanStore();
const permission = UsePagePermission();

const response = computed(() => store.response_query_data);

onMounted(async () => {
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

const headers = ref([
  { title: "ລຳດັບ", key: "no", sortable: false },
  { title: "ຊື່ແພັກເກັດ", key: "plan_name", sortable: false },
  { title: "ລາຄາ/ເດືອນ", key: "price_monthly", sortable: false },
  { title: "ຈຳນວນຜູ້ໃຊ້ສູງສຸດ", key: "max_users", sortable: false },
  { title: "ຈຳນວນສິນຄ້າສູງສຸດ", key: "max_products", sortable: false },
  { title: "Actions", key: "actions", sortable: false },
]);

const formatNumber = (num: number) => new Intl.NumberFormat().format(num);

const goPath = (path: string) => {
  router.push(path);
};
</script>

<template>
  <div class="pa-6">
    <v-card elevation="0" tile width="100%" min-height="95vh" class="pa-6">
      <v-row>
        <v-col cols="12">
          <GlobalTextTitleLine
            :title="`ແພັກເກັດຄ່າບໍລິການ / Subscription Plans (${formatNumber(
              response?.pagination?.total_items ?? 0
            )})`"
          />
        </v-col>

        <v-col cols="12" class="d-flex justify-end">
          <div v-if="permission.can_create" class="d-flex flex-wrap align-center">
            <v-btn color="primary" elevation="0" @click="goPath('/subscription-plan/create')">
              <v-icon class="mr-2">mdi-plus</v-icon>
              ເພີ່ມແພັກເກັດ
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

            <template v-slot:item.price_monthly="{ item }">
              {{ formatNumber(item.price_monthly) }}
            </template>

            <template v-slot:item.actions="{ item }">
              <v-btn
                v-if="permission.can_update"
                color="primary"
                icon="mdi-pencil"
                variant="text"
                @click="goPath(`/subscription-plan/edit?id=${item.id}`)"
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
