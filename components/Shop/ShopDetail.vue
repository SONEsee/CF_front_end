<script lang="ts" setup>
import { useRoute } from "vue-router";
import { UseShopStore } from "@/stores/shop";

const route = useRoute();
const id = route.query.id as string;
const shopStore = UseShopStore();
const shop = computed(() => shopStore.response_detail_query_data);

onMounted(() => {
  shopStore.GetDetailData(id);
});
</script>

<template>
  <section>
    <v-row>
      <v-col cols="12">
        <GlobalTextTitleLine title="ລາຍລະອຽດຮ້ານຄ້າ" />
      </v-col>

      <v-col cols="12" md="6">
        <GlobalAvatarProfileImage :image_url="shop?.image_url ?? undefined" size="80" class="mb-4" />
        <p><strong>ຊື່ຮ້ານຄ້າ:</strong> {{ shop?.shop_name }}</p>
        <p><strong>ເບີໂທລະສັບ:</strong> {{ shop?.phone }}</p>
        <p><strong>Owner User ID:</strong> {{ shop?.owner_user_id ?? "-" }}</p>
        <p><strong>Timezone:</strong> {{ shop?.timezone }}</p>
        <p><strong>ສະຖານະ:</strong> {{ shop?.status }}</p>
      </v-col>
    </v-row>
  </section>
</template>
