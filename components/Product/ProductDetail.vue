<script lang="ts" setup>
import { useRoute } from "vue-router";
import { UseProductStore } from "@/stores/product";

const route = useRoute();
const store = UseProductStore();
const permission = UsePagePermission();
const title = ref("ລາຍລະອຽດສິນຄ້າ");
const { shopName } = UseShopNameResolver();
const { categoryName } = UseCategoryNameResolver();

const productId = computed(() => route.query.id as string);
const productIdNumber = computed(() => Number(productId.value));
const detail = computed(() => store.response_detail_query_data);
const activeTab = ref("general");

const goPath = (path: string) => {
  navigateTo(path);
};

onMounted(async () => {
  if (!productId.value) return;
  await store.GetDetailData(productId.value);
});
</script>

<template>
  <section class="pa-6">
    <v-card elevation="0" class="pa-6">
      <GlobalTextTitleLine :title="title" class="mb-8">
        <template #actions>
          <v-btn variant="outlined" @click="goPath('/product')">ກັບຄືນ</v-btn>
        </template>
      </GlobalTextTitleLine>

      <GlobalPermissionDenied v-if="!permission.can_view" />

      <template v-else-if="detail">
        <v-row class="mb-4">
          <v-col cols="12" class="d-flex align-center">
            <GlobalAvatarProfileImage :image_url="detail.image_main_url ?? undefined" size="96" />
            <div class="ml-6">
              <div class="text-h6">{{ detail.product_name }}</div>
            </div>
          </v-col>
        </v-row>

        <v-tabs v-model="activeTab" class="mb-6">
          <v-tab value="general">ຂໍ້ມູນທົ່ວໄປ</v-tab>
          <v-tab value="variant">ຕົວເລືອກສິນຄ້າ</v-tab>
          <v-tab value="image">ຮູບພາບ</v-tab>
        </v-tabs>

        <v-window v-model="activeTab">
          <v-window-item value="general">
            <v-row>
              <v-col cols="12" md="6">
                <label class="d-block mb-2 text-grey">ຮ້ານຄ້າ / Shop</label>
                <div class="text-body-1 mb-4">{{ shopName(detail.shop_id) }}</div>

                <label class="d-block mb-2 text-grey">ໝວດໝູ່ / Category</label>
                <div class="text-body-1 mb-4">{{ categoryName(detail.category_id) }}</div>
              </v-col>

              <v-col cols="12" md="6">
                <label class="d-block mb-2 text-grey">ລາຍລະອຽດ / Description</label>
                <div class="text-body-1 mb-4">{{ detail.description || "-" }}</div>

                <label class="d-block mb-2 text-grey">ສະຖານະ ການໃຊ້ງານ</label>
                <div class="mb-4">
                  <v-chip v-if="detail.is_active" color="info">ເປີດໃຊ້ງານ</v-chip>
                  <v-chip v-else color="error">ປິດໃຊ້ງານ</v-chip>
                </div>
              </v-col>
            </v-row>
          </v-window-item>

          <v-window-item value="variant">
            <ProductVariantList v-if="productIdNumber" :product-id="productIdNumber" />
          </v-window-item>

          <v-window-item value="image">
            <ProductImageList v-if="productIdNumber" :product-id="productIdNumber" />
          </v-window-item>
        </v-window>
      </template>

      <v-row v-else>
        <v-col cols="12" class="text-center py-8 text-grey">
          <v-progress-circular v-if="store.loading" indeterminate color="primary" />
          <span v-else>ບໍ່ພົບຂໍ້ມູນສິນຄ້າ</span>
        </v-col>
      </v-row>
    </v-card>
  </section>
</template>
