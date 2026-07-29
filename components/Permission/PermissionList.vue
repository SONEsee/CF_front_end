<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { UsePermissionStore } from "@/stores/permission";
import { UseRoleStore } from "@/stores/role";
import { UseSubMenuStore } from "@/stores/submenu";

const router = useRouter();
const store = UsePermissionStore();
const roleStore = UseRoleStore();
const submenuStore = UseSubMenuStore();
const permission = UsePagePermission();

const response = computed(() => store.response_query_data);
const { tableRows } = UsePermissionTableRows(
  computed(() => response.value?.list_data),
);

onMounted(async () => {
  roleStore.GetRoleOptions();
  submenuStore.GetSubMenuOptions();
  store.GetListData();
});

function getRoleName(id: number) {
  return roleStore.role_options.find((r) => r.id === id)?.role_name ?? "-"; 
}
function getSubMenuName(id: number) {
  return subMenuStore.submenu_options.find((s) => s.id === id)?.submenu_name ?? "-"; 
}

const request = store.request_query_data;
const roleOptionsLoading = computed(() => roleStore.role_options_loading);
const submenuOptionsLoading = computed(
  () => submenuStore.submenu_options_loading,
);

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

const onsetinput = async (input: string | null) => {
  request.q = input ?? null;
  request.page = 1;
  await store.GetListData();
};

const headers = ref([
  { title: "ລຳດັບ", key: "no", sortable: false },
  { title: "ສິດການນຳໃຊ້", key: "role_name", sortable: false },
  { title: "ເມນູຍ່ອຍ", key: "submenu_name", sortable: false },
  { title: "ເບິ່ງ", key: "can_view", sortable: false },
  { title: "ສ້າງ", key: "can_create", sortable: false },
  { title: "ແກ້ໄຂ", key: "can_update", sortable: false },
  { title: "ລົບ", key: "can_delete", sortable: false },
  { title: "ຈັດການ", key: "actions", sortable: false },
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
            :title="`ຈັດການສິດອະນຸຍາດ / Manage Permission (${formatNumber(
              response?.pagination?.total_items ?? 0,
            )})`"
          />
        </v-col>

        <v-col
          cols="12"
          class="d-flex flex-wrap justify-space-between align-center"
        >
          <div class="d-flex flex-wrap ga-4 align-end">
            <div style="width: 240px">
              <GlobalDebounceEventTextField
                :input="request.q"
                :label="'ຄົ້ນຫາ'"
                @setinput="onsetinput"
                hide-details
              />
            </div>
            <div style="width: 240px">
              <v-autocomplete
                v-model.number="request.role_id"
                :items="roleStore.role_options"
                :loading="roleOptionsLoading"
                item-title="role_name"
                item-value="id"
                label="ສິດການນຳໃຊ້"
                clearable
                density="compact"
                variant="outlined"
                hide-details
                @update:model-value="onFilterChange"
              ></v-autocomplete>
            </div>
            <div style="width: 240px">
              <v-autocomplete
                v-model.number="request.submenu_id"
                :items="submenuStore.submenu_options"
                :loading="submenuOptionsLoading"
                item-title="submenu_name"
                item-value="id"
                label="ເມນູຍ່ອຍ"
                clearable
                density="compact"
                variant="outlined"
                hide-details
                @update:model-value="onFilterChange"
              ></v-autocomplete>
            </div>
          </div>

          <div
            v-if="permission.can_create"
            class="d-flex flex-wrap align-center"
          >
            <v-btn
              color="primary"
              elevation="0"
              @click="goPath('/permission/create')"
            >
              <v-icon class="mr-2"> mdi-plus</v-icon>
              ເພີ່ມສິດອະນຸຍາດ
            </v-btn>
          </div>
        </v-col>

        <v-col cols="12">
          <v-data-table
            :headers="headers"
            :items="tableRows"
            :loading="request.loading"
            mobile-breakpoint="sm"
          >
            <template v-slot:item.no="{ index }">
              {{ index + 1 }}
            </template>

            <template v-slot:item.role_id="{ item }">
              {{ getRoleName(item.role_id) }}
            </template>

            <template v-slot:item.submenu_id="{ item }">
              {{ getSubMenuName(item.submenu_id) }}
            </template>

            <template v-slot:item.can_view="{ item }">
              <v-icon :color="item.can_view ? 'success' : 'error'">{{
                item.can_view ? "mdi-check" : "mdi-close"
              }}</v-icon>
            </template>
            <template v-slot:item.can_create="{ item }">
              <v-icon :color="item.can_create ? 'success' : 'error'">{{
                item.can_create ? "mdi-check" : "mdi-close"
              }}</v-icon>
            </template>
            <template v-slot:item.can_update="{ item }">
              <v-icon :color="item.can_update ? 'success' : 'error'">{{
                item.can_update ? "mdi-check" : "mdi-close"
              }}</v-icon>
            </template>
            <template v-slot:item.can_delete="{ item }">
              <v-icon :color="item.can_delete ? 'success' : 'error'">{{
                item.can_delete ? "mdi-check" : "mdi-close"
              }}</v-icon>
            </template>

            <template v-slot:item.actions="{ item }">
              <v-btn
                v-if="permission.can_update"
                color="primary"
                icon="mdi-pencil"
                variant="text"
                @click="goPath(`/permission/edit?id=${item.id}`)"
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