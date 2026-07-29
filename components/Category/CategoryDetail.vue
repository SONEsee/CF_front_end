<script lang="ts" setup>
import { useRoute } from "vue-router";
import { UseCategoryStore } from "@/stores/category";

const route = useRoute();
const store = UseCategoryStore();
const permission = UsePagePermission();
const title = ref("ລາຍລະອຽດໝວດໝູ່ສິນຄ້າ");
const { shopName } = UseShopNameResolver();
const { categoryName } = UseCategoryNameResolver();

const categoryId = computed(() => route.query.id as string);
const detail = computed(() => store.response_detail_query_data);

const goPath = (path: string) => {
  navigateTo(path);
};

onMounted(async () => {
  store.GetCategoryOptions();
  if (!categoryId.value) return;
  await store.GetDetailData(categoryId.value);
});
</script>

<template>
  <section class="pa-6">
    <v-card elevation="0" class="pa-6">
      <GlobalTextTitleLine :title="title" class="mb-8">
        <template #actions>
          <v-btn variant="outlined" @click="goPath('/category')">ກັບຄືນ</v-btn>
        </template>
      </GlobalTextTitleLine>

      <GlobalPermissionDenied v-if="!permission.can_view" />

      <template v-else-if="detail">
        <v-row>
          <v-col cols="12" md="6">
            <label class="d-block mb-2 text-grey">ຊື່ໝວດໝູ່</label>
            <div class="text-body-1 mb-4">{{ detail.name }}</div>

            <label class="d-block mb-2 text-grey">ຮ້ານຄ້າ / Shop</label>
            <div class="text-body-1 mb-4">{{ shopName(detail.shop_id) }}</div>
          </v-col>

          <v-col cols="12" md="6">
            <label class="d-block mb-2 text-grey">ໝວດໝູ່ແມ່ / Parent category</label>
            <div class="text-body-1 mb-4">{{ categoryName(detail.parent_id) }}</div>

            <label class="d-block mb-2 text-grey">ລຳດັບສະແດງ / Sort order</label>
            <div class="text-body-1 mb-4">{{ detail.sort_order }}</div>
          </v-col>
        </v-row>
      </template>

      <v-row v-else>
        <v-col cols="12" class="text-center py-8 text-grey">
          <v-progress-circular v-if="store.loading" indeterminate color="primary" />
          <span v-else>ບໍ່ພົບຂໍ້ມູນໝວດໝູ່</span>
        </v-col>
      </v-row>
    </v-card>
  </section>
</template>
