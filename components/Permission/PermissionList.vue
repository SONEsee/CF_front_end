<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { UsePermissionStore } from "@/stores/permission";

const router = useRouter();
const store = UsePermissionStore();

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
  { title: "Role ID", key: "role_id", sortable: false },
  { title: "Submenu ID", key: "submenu_id", sortable: false },
  { title: "ເບິ່ງ", key: "can_view", sortable: false },
  { title: "ສ້າງ", key: "can_create", sortable: false },
  { title: "ແກ້ໄຂ", key: "can_update", sortable: false },
  { title: "ລົບ", key: "can_delete", sortable: false },
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
            :title="`ຈັດການສິດອະນຸຍາດ / Manage Permission (${formatNumber(
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
            <v-btn color="primary" elevation="0" @click="goPath('/permission/create')">
              <v-icon class="mr-2"> mdi-plus</v-icon>
              ເພີ່ມສິດອະນຸຍາດ
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

            <template v-slot:item.can_view="{ item }">
              <v-icon :color="item.can_view ? 'success' : 'error'">{{ item.can_view ? 'mdi-check' : 'mdi-close' }}</v-icon>
            </template>
            <template v-slot:item.can_create="{ item }">
              <v-icon :color="item.can_create ? 'success' : 'error'">{{ item.can_create ? 'mdi-check' : 'mdi-close' }}</v-icon>
            </template>
            <template v-slot:item.can_update="{ item }">
              <v-icon :color="item.can_update ? 'success' : 'error'">{{ item.can_update ? 'mdi-check' : 'mdi-close' }}</v-icon>
            </template>
            <template v-slot:item.can_delete="{ item }">
              <v-icon :color="item.can_delete ? 'success' : 'error'">{{ item.can_delete ? 'mdi-check' : 'mdi-close' }}</v-icon>
            </template>

            <template v-slot:item.actions="{ item }">
              <v-btn
                color="primary"
                icon="mdi-pencil"
                variant="text"
                @click="goPath(`/permission/edit?id=${item.id}`)"
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
