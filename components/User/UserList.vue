<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { UserStore } from '@/stores/user';

const router = useRouter();
const userStore = UserStore();
const permission = UsePagePermission();
const { shopName } = UseShopNameResolver();
const { roleName } = UseRoleNameResolver();

const response = computed(() => {
  return userStore.response_query_data;
});

onMounted(async () => {
  userStore.GetListData();
});

const request = userStore.request_query_data;

async function onSelectionChange(limit: number) {
  request.limit = limit;
  await userStore.GetListData();
}

async function onPageChange(page: number) {
  request.page = page;
  await userStore.GetListData();
}

const headers = ref([
  { title: "ລຳດັບ", key: "no", sortable: false },
  { title: "ຮູບ", key: "profile_image", sortable: false },
  { title: "ຊື່ຜູ້ໃຊ້ງານ", key: "username", sortable: false },
  { title: "ອີເມວ", key: "email", sortable: false },
  { title: "ຊື່ແທ້", key: "full_name", sortable: false },
  { title: "ຮ້ານຄ້າ", key: "shop_id", sortable: false },
  { title: "ສິດ", key: "role_id", sortable: false },
  { title: "ສະຖານະ", key: "status", sortable: false },
  { title: "Actions", key: "actions", sortable: false },
]);

const formatNumber = (num: number) => {
  return new Intl.NumberFormat().format(num);
};

const goPath = (path: string) => {
  router.push(path);
};

const onsetinput = async (input: string | null) => {
  request.q = input ?? null;
  request.page = 1;
  await userStore.GetListData();
};

const onDelete = async (id: number) => {
  await userStore.DeleteData(id);
};
</script>

<template>
  <div class="pa-2">
    <v-card elevation="0" tile width="100%" min-height="95vh" class="pa-6">
      <v-row>
        <v-col cols="12">
          <GlobalTextTitleLine
            :title="`ໜ້າຈັດການຜູ້ໃຊ້ງານ / Manage User (${formatNumber(
              response?.pagination?.total_items ?? 0
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
                class="mt-2"
                color="primary"
                flat
                :loading="request.loading"
                @click="userStore.GetListData()"
                >ຄົ້ນຫາ</v-btn
              >
            </div>
          </div>

          <div v-if="permission.can_create" class="d-flex flex-wrap align-center">
            <v-btn
              color="primary"
              elevation="0"
              @click="goPath('/user/create')"
            >
              <v-icon class="mr-2"> mdi-plus</v-icon>
              ເພີ່ມຜູ້ໃຊ້ງານ
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

            <template v-slot:item.profile_image="{ item }">
              <GlobalAvatarProfileImage :image_url="item.profile_image ?? undefined" size="40" />
            </template>

            <template v-slot:item.shop_id="{ item }">
              {{ shopName(item.shop_id) }}
            </template>

            <template v-slot:item.role_id="{ item }">
              {{ roleName(item.role_id) }}
            </template>

            <template v-slot:item.status="{ item }">
              <span v-if="item.is_active === true">
                <v-chip color="info">ເປີດໃຊ້ງານ</v-chip>
              </span>
              <span v-else>
                <v-chip color="error">ປິດໃຊ້ງານ</v-chip>
              </span>
            </template>

            <template v-slot:item.actions="{ item }">
              <div class="d-flex flex-wrap ga-1">
                <v-btn
                  v-if="permission.can_update"
                  color="primary"
                  icon="mdi-pencil"
                  variant="text"
                  size="small"
                  @click="goPath(`/user/edit?id=${item.id}`)"
                ></v-btn>

                <v-btn
                  v-if="permission.can_view"
                  color="primary"
                  icon="mdi-eye"
                  variant="text"
                  size="small"
                  @click="goPath(`/user/detail?id=${item.id}`)"
                ></v-btn>

                <v-btn
                  v-if="permission.can_delete"
                  color="error"
                  icon="mdi-delete"
                  variant="text"
                  size="small"
                  @click="onDelete(item.id)"
                ></v-btn>
              </div>
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
