<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { UseProductStore } from "@/stores/product";
import { UseCategoryStore } from "@/stores/category";

const router = useRouter();
const store = UseProductStore();
const categoryStore = UseCategoryStore();
const permission = UsePagePermission();
const { categoryName } = UseCategoryNameResolver();

const response = computed(() => store.response_query_data);
const categoryOptionsLoading = computed(() => categoryStore.category_options_loading);

onMounted(async () => {
  categoryStore.GetCategoryOptions();
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
  { title: "ຮູບ", key: "image_main_url", sortable: false },
  { title: "ຊື່ສິນຄ້າ", key: "product_name", sortable: false },
  { title: "ໝວດໝູ່", key: "category_id", sortable: false },
  { title: "ສະຖານະ", key: "is_active", sortable: false },
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
            :title="`ຈັດການສິນຄ້າ / Manage Product (${formatNumber(
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
                v-model.number="request.category_id"
                :items="categoryStore.category_options"
                :loading="categoryOptionsLoading"
                item-title="name"
                item-value="id"
                label="ໝວດໝູ່"
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
            <v-btn color="primary" elevation="0" @click="goPath('/product/create')">
              <v-icon class="mr-2"> mdi-plus</v-icon>
              ເພີ່ມສິນຄ້າ
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

            <template v-slot:item.image_main_url="{ item }">
              <GlobalAvatarProfileImage :image_url="item.image_main_url ?? undefined" size="40" />
            </template>

            <template v-slot:item.category_id="{ item }">
              {{ categoryName(item.category_id) }}
            </template>

            <template v-slot:item.is_active="{ item }">
              <v-chip v-if="item.is_active" color="info" size="small">ເປີດໃຊ້ງານ</v-chip>
              <v-chip v-else color="error" size="small">ປິດໃຊ້ງານ</v-chip>
            </template>

            <template v-slot:item.actions="{ item }">
              <v-btn
                v-if="permission.can_update"
                color="primary"
                icon="mdi-pencil"
                variant="text"
                @click="goPath(`/product/update?id=${item.id}`)"
                size="small"
              ></v-btn>

              <v-btn
                v-if="permission.can_view"
                color="primary"
                icon="mdi-eye"
                variant="text"
                @click="goPath(`/product/detail?id=${item.id}`)"
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
