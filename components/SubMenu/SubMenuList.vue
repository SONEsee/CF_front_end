<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { UseSubMenuStore } from "@/stores/submenu";

const router = useRouter();
const store = UseSubMenuStore();
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
  { title: "Main Menu ID", key: "main_menu_id", sortable: false },
  { title: "ຊື່ເມນູຍ່ອຍ", key: "submenu_name", sortable: false },
  { title: "Route path", key: "route_path", sortable: false },
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
            :title="`ຈັດການເມນູຍ່ອຍ / Manage Sub Menu (${formatNumber(
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

          <div v-if="permission.can_create" class="d-flex flex-wrap align-center">
            <v-btn color="primary" elevation="0" @click="goPath('/sub-menu/create')">
              <v-icon class="mr-2"> mdi-plus</v-icon>
              ເພີ່ມເມນູຍ່ອຍ
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

            <template v-slot:item.actions="{ item }">
              <v-btn
                v-if="permission.can_update"
                color="primary"
                icon="mdi-pencil"
                variant="text"
                @click="goPath(`/sub-menu/edit?id=${item.id}`)"
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
