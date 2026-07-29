<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { UseCustomerStore } from "@/stores/customer";
import { UseShopStore } from "@/stores/shop";

const router = useRouter();
const store = UseCustomerStore();
const shopStore = UseShopStore();
const permission = UsePagePermission();
const { shopName } = UseShopNameResolver();

const response = computed(() => store.response_query_data);
const shopOptionsLoading = computed(() => shopStore.shop_options_loading);

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
  { title: "ລຳດັບ", key: "no", sortable: false },
  { title: "ຮູບ", key: "profile_pic_url", sortable: false },
  { title: "ຊື່ລູກຄ້າ", key: "customer_name", sortable: false },
  { title: "ເບີໂທ", key: "phone_number", sortable: false },
  { title: "ຮ້ານຄ້າ", key: "shop_id", sortable: false },
  { title: "Actions", key: "actions", sortable: false },
]);

const formatNumber = (num: number) => new Intl.NumberFormat().format(num);

const goPath = (path: string) => {
  router.push(path);
};

const onsetinput = async (input: string | null) => {
  request.q = input ?? null;
  request.page = 1;
  await store.GetListData();
};
</script>

<template>
  <div class="pa-6">
    <v-card elevation="0" tile width="100%" min-height="95vh" class="pa-6">
      <v-row>
        <v-col cols="12">
          <GlobalTextTitleLine
            :title="`ຈັດການລູກຄ້າ / Manage Customer (${formatNumber(
              response?.pagination?.total_items ?? 0
            )})`"
          />
        </v-col>

        <v-col
          cols="12"
          class="d-flex flex-wrap justify-space-between align-center"
        >
          <div class="d-flex flex-wrap ga-4 align-end">
            <div style="width: 280px">
              <GlobalDebounceEventTextField
                :input="request.q"
                :label="'ຄົ້ນຫາ'"
                @setinput="onsetinput"
              />
            </div>

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
            <v-btn color="primary" elevation="0" @click="goPath('/customer/create')">
              <v-icon class="mr-2"> mdi-plus</v-icon>
              ເພີ່ມລູກຄ້າ
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

            <template v-slot:item.profile_pic_url="{ item }">
              <GlobalAvatarProfileImage :image_url="item.profile_pic_url ?? undefined" size="40" />
            </template>

            <template v-slot:item.customer_name="{ item }">
              {{ item.customer_name || "-" }}
            </template>

            <template v-slot:item.phone_number="{ item }">
              {{ item.phone_number || "-" }}
            </template>

            <template v-slot:item.shop_id="{ item }">
              {{ shopName(item.shop_id) }}
            </template>

            <template v-slot:item.actions="{ item }">
              <v-btn
                v-if="permission.can_update"
                color="primary"
                icon="mdi-pencil"
                variant="text"
                @click="goPath(`/customer/edit?id=${item.id}`)"
                size="small"
              ></v-btn>

              <v-btn
                v-if="permission.can_view"
                color="primary"
                icon="mdi-eye"
                variant="text"
                @click="goPath(`/customer/detail?id=${item.id}`)"
                size="small"
              ></v-btn>

              <v-btn
                v-if="permission.can_delete"
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
