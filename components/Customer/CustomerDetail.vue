<script lang="ts" setup>
import { useRoute } from "vue-router";
import { UseCustomerStore } from "@/stores/customer";

const route = useRoute();
const store = UseCustomerStore();
const permission = UsePagePermission();
const title = ref("ລາຍລະອຽດລູກຄ້າ");
const { shopName } = UseShopNameResolver();

const customerId = computed(() => route.query.id as string);
const customerIdNumber = computed(() => Number(customerId.value));
const detail = computed(() => store.response_detail_query_data);
const activeTab = ref("general");

const goPath = (path: string) => {
  navigateTo(path);
};

onMounted(async () => {
  if (!customerId.value) return;
  await store.GetDetailData(customerId.value);
});
</script>

<template>
  <section class="pa-6">
    <v-card elevation="0" class="pa-6">
      <GlobalTextTitleLine :title="title" class="mb-8">
        <template #actions>
          <v-btn variant="outlined" @click="goPath('/customer')">ກັບຄືນ</v-btn>
        </template>
      </GlobalTextTitleLine>

      <GlobalPermissionDenied v-if="!permission.can_view" />

      <template v-else-if="detail">
        <v-row class="mb-4">
          <v-col cols="12" class="d-flex align-center">
            <GlobalAvatarProfileImage :image_url="detail.profile_pic_url ?? undefined" size="96" />
            <div class="ml-6">
              <div class="text-h6">{{ detail.customer_name || "-" }}</div>
            </div>
          </v-col>
        </v-row>

        <v-tabs v-model="activeTab" class="mb-6">
          <v-tab value="general">ຂໍ້ມູນທົ່ວໄປ</v-tab>
          <v-tab value="address">ທີ່ຢູ່</v-tab>
        </v-tabs>

        <v-window v-model="activeTab">
          <v-window-item value="general">
            <v-row>
              <v-col cols="12" md="6">
                <label class="d-block mb-2 text-grey">ຮ້ານຄ້າ / Shop</label>
                <div class="text-body-1 mb-4">{{ shopName(detail.shop_id) }}</div>

                <label class="d-block mb-2 text-grey">ເບີໂທ / Phone</label>
                <div class="text-body-1 mb-4">{{ detail.phone_number || "-" }}</div>

                <label class="d-block mb-2 text-grey">Social Platform ID</label>
                <div class="text-body-1 mb-4">{{ detail.social_platform_id || "-" }}</div>
              </v-col>

              <v-col cols="12" md="6">
                <label class="d-block mb-2 text-grey">Tags</label>
                <div class="text-body-1 mb-4">{{ detail.tags || "-" }}</div>

                <label class="d-block mb-2 text-grey">ໝາຍເຫດ / Note</label>
                <div class="text-body-1 mb-4">{{ detail.note || "-" }}</div>
              </v-col>
            </v-row>
          </v-window-item>

          <v-window-item value="address">
            <CustomerAddressList v-if="customerIdNumber" :customer-id="customerIdNumber" />
          </v-window-item>
        </v-window>
      </template>

      <v-row v-else>
        <v-col cols="12" class="text-center py-8 text-grey">
          <v-progress-circular v-if="store.loading" indeterminate color="primary" />
          <span v-else>ບໍ່ພົບຂໍ້ມູນລູກຄ້າ</span>
        </v-col>
      </v-row>
    </v-card>
  </section>
</template>
