<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { UseShopStore } from "@/stores/shop";

const router = useRouter();
const shopStore = UseShopStore();
const permission = UsePagePermission();

const response = computed(() => shopStore.response_query_data);
const request = shopStore.request_query_data;

onMounted(async () => {
  await shopStore.GetListData();
});

async function onSelectionChange(limit: number) {
  request.limit = limit;
  request.page = 1; 
  await shopStore.GetListData();
}

async function onPageChange(page: number) {
  request.page = page;
  await shopStore.GetListData();
}

const headers = [
  { title: "ລຳດັບ", key: "no", sortable: false },
  { title: "ໂລໂກ້", key: "image_url", sortable: false},
  { title: "ຊື່ຮ້ານ", key: "shop_name", sortable: false },
  { title: "ເບີໂທ", key: "phone", sortable: false },
  { title: "Timezone", key: "timezone" },
  { title: "ສະຖານະ", key: "status" },
  { title: "ຈັດການ", key: "actions" },
] as const;

const formatNumber = (num: number) => new Intl.NumberFormat().format(num);

const goPath = (path: string) => {
  router.push(path);
};

const onsetinput = async (input: string | null) => {
  request.q = input ?? null;
  request.page = 1;
  await shopStore.GetListData();
};

const statusConfig = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return { color: "green-darken-2", icon: "mdi-check-circle" };
    case "TRIAL":
      return { color: "orange-darken-2", icon: "mdi-clock-outline" };
    case "SUSPENDED":
      return { color: "red-darken-2", icon: "mdi-alert-circle" };
    default:
      return { color: "grey-darken-1", icon: "mdi-help-circle" };
  }
};

const isConfirmDialog = ref(false);
const selectedItem = ref<any>(null);

const openConfirmDialog = (item: any) => {
  selectedItem.value = item;
  isConfirmDialog.value = true;
};

const confirmChangeStatus = async () => {
  if (!selectedItem.value) return;
  const newStatus = selectedItem.value.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
  await shopStore.UpdateStatus(selectedItem.value.id, newStatus);
  isConfirmDialog.value = false;
  selectedItem.value = null;
};
</script>

<template>
  <div class="pa-4 pa-md-6 bg-grey-lighten-4" style="min-height: 100vh;">
    <v-card elevation="1" rounded="lg" width="100%" min-height="95vh" class="pa-4 pa-md-6 bg-white">
      <v-row>
        <!-- ຫົວຂໍ້ -->
        <v-col cols="12">
          <GlobalTextTitleLine
            :title="`ໜ້າຈັດການຮ້ານຄ້າ / Manage Shop (${formatNumber(
              response?.pagination?.total_items ?? 0
            )})`"
          />
        </v-col>

        <!-- ສ່ວນຄົ້ນຫາ ແລະ ປຸ່ມເພີ່ມ -->
        <v-col cols="12" class="d-flex flex-column flex-md-row flex-wrap justify-space-between align-stretch align-md-center ga-4 py-2">
          <div class="d-flex flex-column flex-sm-row flex-nowrap ga-3" style="min-width: 300px;">
            <div class="w-100" style="max-width: 300px">
              <GlobalDebounceEventTextField
                :input="request.q"
                :label="'ຄົ້ນຫາຊື່ຮ້ານ ຫຼື ເບີໂທ...'"
                @setinput="onsetinput"
              />
            </div>
            <div class="d-flex align-end flex-shrink-0">
              <v-btn
                class="w-100 w-sm-auto"
                color="primary"
                
                :loading="request.loading"
                @click="shopStore.GetListData()"
              >
                <v-icon start>mdi-magnify</v-icon>
                ຄົ້ນຫາ
              </v-btn>
            </div>
          </div>

          <div v-if="permission.can_create" class="d-flex">
            <v-btn class="w-100 w-md-auto" color="primary"  @click="goPath('/shop/create')">
              <v-icon start> mdi-plus </v-icon>
              ເພີ່ມຮ້ານຄ້າ
            </v-btn>
          </div>
        </v-col>

        <v-col cols="12" class="py-0">
          <v-divider></v-divider>
        </v-col>

    
        <v-col cols="12" class="mt-2">
          
          <v-data-table
            class="text-no-wrap"
            :headers="headers"
            :items="response?.list_data ?? []"
            :loading="request.loading"
            density="compact"
            hover
            mobile-breakpoint="sm"
            items-per-page-text="ສະແດງຂໍ້ມູນຕໍ່ໜ້າ:"
          >
            <template v-slot:no-data>
              <div class="d-flex flex-column align-center justify-center py-12 text-grey-darken-1">
                <v-icon icon="mdi-store-search-outline" size="56" class="mb-4"></v-icon>
                <p class="text-body-1 font-weight-medium mb-1">ຍັງບໍ່ມີຂໍ້ມູນຮ້ານຄ້າ</p>
                <p class="text-body-2 mb-4">
                  {{ request.q ? `ບໍ່ພົບຮ້ານຄ້າທີ່ກົງກັບ "${request.q}"` : "ເລີ່ມຕົ້ນໂດຍການເພີ່ມຮ້ານຄ້າທຳອິດຂອງທ່ານ" }}
                </p>
                <v-btn
                  v-if="!request.q && permission.can_create"
                  color="primary"
                  variant="tonal"
                  @click="goPath('/shop/create')"
                >
                  <v-icon start>mdi-plus</v-icon>
                  ເພີ່ມຮ້ານຄ້າ
                </v-btn>
              </div>
            </template>

            <template v-slot:item.no="{ index }">
              <span class="font-weight-bold text-grey-darken-1">
                {{ (request.page - 1) * request.limit + index + 1 }}
              </span>
            </template>

            <template v-slot:item.image_url="{ item }">
              <div class="d-flex justify-center py-2">
                <GlobalAvatarProfileImage :image_url="item.image_url ?? undefined" size="42" />
              </div>
            </template>

            <template v-slot:item.shop_name="{ item }">
              <span class="font-weight-medium text-body-1 text-primary">{{ item.shop_name }}</span>
            </template>

            <template v-slot:item.status="{ item }">
              <v-chip 
                :color="statusConfig(item.status).color" 
                size="small" 
                variant="tonal" 
                label
              >
                <v-icon start :icon="statusConfig(item.status).icon" size="small"></v-icon>
                {{ item.status }}
              </v-chip>
            </template>

            <template v-slot:item.actions="{ item }">
              <div class="d-flex justify-center flex-wrap ga-1">
                <v-tooltip location="top" text="ເບິ່ງລາຍລະອຽດ">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-if="permission.can_view"
                      v-bind="props"
                      color="grey-darken-2"
                      icon="mdi-eye-outline"
                      variant="text"
                      size="small"
                      @click="goPath(`/shop/detail?id=${item.id}`)"
                    ></v-btn>
                  </template>
                </v-tooltip>

                <v-tooltip location="top" text="ແກ້ໄຂຂໍ້ມູນ">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-if="permission.can_update"
                      v-bind="props"
                      color="indigo-darken-2"
                      icon="mdi-pencil-outline"
                      variant="text"
                      size="small"
                      @click="goPath(`/shop/edit?id=${item.id}`)"
                    ></v-btn>
                  </template>
                </v-tooltip>

                <v-tooltip location="top" :text="item.status === 'ACTIVE' ? 'ປິດການໃຊ້ງານຮ້ານ' : 'ເປີດການໃຊ້ງານຮ້ານ'">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-if="permission.can_delete"
                      v-bind="props"
                      :color="item.status === 'ACTIVE' ? 'red-darken-2' : 'green-darken-2'"
                      :icon="item.status === 'ACTIVE' ? 'mdi-power-plug-off-outline' : 'mdi-power-plug-outline'"
                      variant="text"
                      size="small"
                      @click="openConfirmDialog(item)"
                    ></v-btn>
                  </template>
                </v-tooltip>
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

    <!-- Dialog ສຳລັບການຢືນຢັນການປ່ຽນສະຖານະ -->
    <v-dialog v-model="isConfirmDialog" max-width="400px" persistent>
      <v-card rounded="lg">
        <v-card-title class="text-h6 font-weight-bold d-flex align-center">
          <v-icon color="orange-darken-2" class="mr-2">mdi-alert</v-icon>
          ຢືນຢັນການປ່ຽນສະຖານະ
        </v-card-title>
        <v-card-text class="text-body-1 pt-2">
          ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອນການປ່ຽນສະຖານະຂອງຮ້ານ 
          <span class="font-weight-bold text-primary">"{{ selectedItem?.shop_name }}"</span> 
          ເປັນ 
          <span class="font-weight-bold" :class="selectedItem?.status === 'ACTIVE' ? 'text-red-darken-2' : 'text-green-darken-2'">
            {{ selectedItem?.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' }}
          </span>?
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" @click="isConfirmDialog = false">
            ຍົກເລີກ
          </v-btn>
          <v-btn 
            color="primary" 
            variant="tonal"
            @click="confirmChangeStatus"
          >
            ຢືນຢັນ
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>