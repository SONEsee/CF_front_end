<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { UserStore } from '@/stores/user';

const router = useRouter();
const userStore = UserStore();
const permission = UsePagePermission();

// ຖ້າ profile_image ເປັນ path relative (ເຊັ່ນ /uploads/profile/xxx.jpg)
// ຕ້ອງຕໍ່ກັບ base URL ຂອງ backend (ບໍ່ແມ່ນ frontend origin)
const API_BASE_URL = import.meta.env.VITE_BASE_URL ?? '';


function getAvatarUrl(profileImage: string | null | undefined) {
  if (!profileImage) return null;
  if (profileImage.startsWith('http')) return profileImage;
  return `${API_BASE_URL}${profileImage}`;
}

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
  { title: "ຮູບພາບ", key: "avatar", sortable: false },
  { title: "ຊື່ຜູ້ໃຊ້ງານ", key: "username", sortable: false },
  { title: "ອີເມວ", key: "email", sortable: false },
  { title: "ຊື່ແທ້", key: "full_name", sortable: false },
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
  if (request !== null) {
    request.q = input ?? null;
    request.page = 1; // ຄົ້ນຫາໃໝ່ ໃຫ້ກັບໄປໜ້າ 1
    await userStore.GetListData();
  }
};

const onDelete = async (id: number) => {
  await userStore.DeleteData(id);
};
</script>
<template>
  <div class="pa-6">
    <v-card elevation="0" tile width="100%" min-height="95vh" class="pa-6">
      <v-row>
        <v-col cols="12">
          <GlobalTextTitleLine
            :title="`ໜ້າຈັດການຜູ້ໃຊ້ງານ / Manage User (${formatNumber(
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
                :label="'ຄົ້ນຫາ (ຊື່, username, email, ເບີໂທ)'"
                @setinput="onsetinput"
              />
            </div>

            <div class="d-flex align-end">
              <v-btn
                class="w-100 w-sm-auto"
                color="primary"
                flat
                :loading="request.loading"
                @click="userStore.GetListData()"
                >ຄົ້ນຫາ</v-btn
              >
            </div>
          </div>

          <div v-if="permission.can_create" class="d-flex">
            <v-btn
              class="w-100 w-md-auto"
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

            <template v-slot:item.avatar="{ item }">
              <v-avatar size="40" color="grey-lighten-2">
                <v-img
                  v-if="getAvatarUrl(item.profile_image)"
                  :src="getAvatarUrl(item.profile_image)!"
                  cover
                  :alt="item.full_name"
                >
                  <template v-slot:placeholder>
                    <v-icon size="20" color="grey-darken-1">mdi-account</v-icon>
                  </template>
                  <template v-slot:error>
                    <v-icon size="20" color="grey-darken-1">mdi-account</v-icon>
                  </template>
                </v-img>
                <v-icon v-else size="20" color="grey-darken-1">mdi-account</v-icon>
              </v-avatar>
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
                  @click="goPath(`/user/edit?id=${item.id}`)"
                ></v-btn>

                <v-btn
                  v-if="permission.can_view"
                  color="primary"
                  icon="mdi-eye"
                  variant="text"
                  @click="goPath(`/user/detail?id=${item.id}`)"
                ></v-btn>

                <v-btn
                  v-if="permission.can_delete"
                  color="error"
                  icon="mdi-delete"
                  variant="text"
                  @click="onDelete(item.id)"
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