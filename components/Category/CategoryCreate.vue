<script lang="ts" setup>
import { UseCategoryStore } from "@/stores/category";
import { UseShopStore } from "@/stores/shop";

const store = UseCategoryStore();
const shopStore = UseShopStore();
const permission = UsePagePermission();
const loading = computed(() => store.loading);
const form = ref();
const shopOptionsLoading = computed(() => shopStore.shop_options_loading);
const categoryOptionsLoading = computed(() => store.category_options_loading);

const request = ref({
  shop_id: null as number | null,
  parent_id: null as number | null,
  name: "",
  sort_order: 0 as number | null,
});

onMounted(() => {
  shopStore.GetShopOptions();
  store.GetCategoryOptions();
});

const submitForm = async () => {
  const { valid } = await form.value.validate();
  if (!valid) return;

  await store.CreateData({
    shop_id: request.value.shop_id as number,
    parent_id: request.value.parent_id,
    name: request.value.name,
    sort_order: request.value.sort_order ?? undefined,
  });
};
</script>

<template>
  <section class="pa-6">
    <v-card elevation="0" class="pa-6">
      <GlobalTextTitleLine title="ເພີ່ມໝວດໝູ່ສິນຄ້າ" class="mb-8">
        <template v-if="permission.can_create" #actions>
          <v-btn color="primary" flat type="submit" form="category-create-form" :loading="loading"
            >ບັນທຶກ</v-btn
          >
        </template>
      </GlobalTextTitleLine>

      <GlobalPermissionDenied v-if="!permission.can_create" />

      <v-form v-else id="category-create-form" ref="form" @submit.prevent="submitForm">
        <v-row>
          <v-col cols="12" md="6">
            <label class="d-block mb-2">ຊື່ໝວດໝູ່ / Category name</label>
            <v-text-field
              v-model="request.name"
              :rules="[(v: string) => !!v || 'ກະລຸນາປ້ອນຊື່ໝວດໝູ່']"
              density="compact"
              variant="outlined"
              hide-details="auto"
              class="mb-6"
            ></v-text-field>

            <label class="d-block mb-2">ຮ້ານຄ້າ / Shop</label>
            <v-autocomplete
              :items="shopStore.shop_options"
              :loading="shopOptionsLoading"
              v-model.number="request.shop_id"
              item-title="shop_name"
              item-value="id"
              :rules="[(v: number) => !!v || 'ກະລຸນາເລືອກຮ້ານຄ້າ']"
              density="compact"
              variant="outlined"
              hide-details="auto"
            ></v-autocomplete>
          </v-col>

          <v-col cols="12" md="6">
            <label class="d-block mb-2">ໝວດໝູ່ແມ່ / Parent category</label>
            <v-autocomplete
              :items="store.category_options"
              :loading="categoryOptionsLoading"
              v-model.number="request.parent_id"
              item-title="name"
              item-value="id"
              clearable
              placeholder="ກະລຸນາເລືອກໝວດໝູ່ແມ່ (ຖ້າມີ)"
              density="compact"
              variant="outlined"
              hide-details="auto"
              class="mb-6"
            ></v-autocomplete>

            <label class="d-block mb-2">ລຳດັບສະແດງ / Sort order</label>
            <v-text-field
              v-model.number="request.sort_order"
              type="number"
              density="compact"
              variant="outlined"
              hide-details="auto"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
  </section>
</template>
