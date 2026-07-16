<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { UseShopBankAccountStore } from "@/stores/shopbankaccount";

const router = useRouter();
const store = UseShopBankAccountStore();

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
  { title: "Shop ID", key: "shop_id", sortable: false },
  { title: "ທະນາຄານ", key: "bank_name", sortable: false },
  { title: "ເລກບັນຊີ", key: "account_number", sortable: false },
  { title: "ຊື່ບັນຊີ", key: "account_name", sortable: false },
  { title: "ສະຖານະ", key: "is_active", sortable: false },
  { title: "Actions", key: "actions", sortable: false },
]);

const formatNumber = (num: number) => new Intl.NumberFormat().format(num);

const goPath = (path: string) => {
  router.push(path);
};

const onsetinput = async (input: string | null) => {
  request.q = input ?? null;
  await store.GetListData();
};
</script>

<template>
  <div class="pa-6">
    <v-card elevation="0" tile width="100%" min-height="95vh" class="pa-6">
      <v-row>
        <v-col cols="12">
          <GlobalTextTitleLine
            :title="`ບັນຊີທະນາຄານຮ້ານຄ້າ / Shop Bank Account (${formatNumber(
              response?.pagination?.total_page ?? 0
            )})`"
          />
        </v-col>

        <v-col
          cols="12"
          class="d-flex flex-wrap justify-space-between align-center"
        >
          <div class="d-flex flex-wrap">
            <div style="width: 280px">
              <GlobalDebounceEventTextField
                :input="request.q"
                :label="'ຄົ້ນຫາ'"
                @setinput="onsetinput"
              />
            </div>
            <div class="ml-4 pt-6">
              <v-btn
                color="primary"
                flat
                :loading="request.loading"
                @click="store.GetListData()"
                >ຄົ້ນຫາ</v-btn
              >
            </div>
          </div>

          <div class="d-flex flex-wrap align-center">
            <v-btn color="primary" elevation="0" @click="goPath('/shop-bank-account/create')">
              <v-icon class="mr-2"> mdi-plus</v-icon>
              ເພີ່ມບັນຊີທະນາຄານ
            </v-btn>
          </div>
        </v-col>

        <v-col cols="12">
          <v-data-table
            :headers="headers"
            :items="response?.list_data ?? []"
            :loading="request.loading"
          >
            <template v-slot:item.no="{ index }">
              {{ index + 1 }}
            </template>

            <template v-slot:item.is_active="{ item }">
              <span v-if="item.is_active">
                <v-chip color="info">ເປີດໃຊ້ງານ</v-chip>
              </span>
              <span v-else>
                <v-chip color="error">ປິດໃຊ້ງານ</v-chip>
              </span>
            </template>

            <template v-slot:item.actions="{ item }">
              <v-btn
                color="primary"
                icon="mdi-pencil"
                variant="text"
                @click="goPath(`/shop-bank-account/edit?id=${item.id}`)"
                size="small"
              ></v-btn>

              <v-btn
                color="error"
                icon="mdi-delete"
                variant="text"
                @click="store.DeleteData(item.id)"
                size="small"
              ></v-btn>
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
