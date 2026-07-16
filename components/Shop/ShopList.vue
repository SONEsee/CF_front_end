<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { UseShopStore } from "@/stores/shop";

const router = useRouter();
const shopStore = UseShopStore();

const response = computed(() => shopStore.response_query_data);

onMounted(async () => {
  shopStore.GetListData();
});

const request = shopStore.request_query_data;

async function onSelectionChange(limit: number) {
  request.limit = limit;
  await shopStore.GetListData();
}

async function onPageChange(page: number) {
  request.page = page;
  await shopStore.GetListData();
}

const headers = ref([
  { title: "ລຳດັບ", key: "no", sortable: false },
  { title: "ຊື່ຮ້ານ", key: "shop_name", sortable: false },
  { title: "ເບີໂທ", key: "phone", sortable: false },
  { title: "Timezone", key: "timezone", sortable: false },
  { title: "ສະຖານະ", key: "status", sortable: false },
  { title: "Actions", key: "actions", sortable: false },
]);

const formatNumber = (num: number) => new Intl.NumberFormat().format(num);

const goPath = (path: string) => {
  router.push(path);
};

const onsetinput = async (input: string | null) => {
  request.q = input ?? null;
  await shopStore.GetListData();
};

const statusColor = (status: string) => {
  if (status === "ACTIVE") return "info";
  if (status === "TRIAL") return "warning";
  return "error";
};
</script>

<template>
  <div class="pa-6">
    <v-card elevation="0" tile width="100%" min-height="95vh" class="pa-6">
      <v-row>
        <v-col cols="12">
          <GlobalTextTitleLine
            :title="`ໜ້າຈັດການຮ້ານຄ້າ / Manage Shop (${formatNumber(
              response?.pagination?.total_page ?? 0
            )})`"
          />
        </v-col>

        <v-col
          cols="12"
          class="d-flex flex-column flex-md-row flex-wrap justify-space-between align-stretch align-md-center ga-4"
        >
          <div class="d-flex flex-column flex-sm-row flex-wrap ga-2">
            <div class="w-100" style="max-width: 280px">
              <GlobalDebounceEventTextField
                :input="request.q"
                :label="'ຄົ້ນຫາ'"
                @setinput="onsetinput"
              />
            </div>
            <div class="d-flex align-end">
              <v-btn
                class="w-100 w-sm-auto"
                color="primary"
                flat
                :loading="request.loading"
                @click="shopStore.GetListData()"
                >ຄົ້ນຫາ</v-btn
              >
            </div>
          </div>

          <div class="d-flex">
            <v-btn class="w-100 w-md-auto" color="primary" elevation="0" @click="goPath('/shop/create')">
              <v-icon class="mr-2"> mdi-plus</v-icon>
              ເພີ່ມຮ້ານຄ້າ
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

            <template v-slot:item.status="{ item }">
              <v-chip :color="statusColor(item.status)">{{ item.status }}</v-chip>
            </template>

            <template v-slot:item.actions="{ item }">
              <div class="d-flex flex-wrap ga-1">
                <v-btn
                  color="primary"
                  icon="mdi-pencil"
                  variant="text"
                  @click="goPath(`/shop/edit?id=${item.id}`)"
                ></v-btn>

                <v-btn
                  color="primary"
                  icon="mdi-eye"
                  variant="text"
                  @click="goPath(`/shop/detail?id=${item.id}`)"
                ></v-btn>

                <v-btn
                  color="error"
                  icon="mdi-cancel"
                  variant="text"
                  @click="shopStore.UpdateStatus(item.id, item.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE')"
                ></v-btn>
              </div>
            </template>

            <template v-slot:bottom>
              <GlobalTablePaginations
                :page="request.page"
                :limit="request.limit"
                :totalpage="response?.pagination?.total_items ?? 1"
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
