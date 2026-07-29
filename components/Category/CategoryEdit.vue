<script lang="ts" setup>
import { useRoute } from "vue-router";
import { UseCategoryStore } from "@/stores/category";

const route = useRoute();
const id = route.query.id as string;
const store = UseCategoryStore();
const permission = UsePagePermission();
const loading = computed(() => store.loading);
const form = ref();
const categoryOptionsLoading = computed(() => store.category_options_loading);

// ບໍ່ໃຫ້ໝວດໝູ່ນີ້ເລືອກຕົນເອງເປັນໝວດໝູ່ແມ່ (ປ້ອງກັນ self-parenting)
const parentOptions = computed(() =>
  store.category_options.filter((c) => String(c.id) !== id)
);

const request = ref({
  parent_id: null as number | null,
  name: "",
  sort_order: 0 as number | null,
});

onMounted(async () => {
  store.GetCategoryOptions();

  await store.GetDetailData(id);
  const category = store.response_detail_query_data;
  if (category) {
    request.value.parent_id = category.parent_id;
    request.value.name = category.name;
    request.value.sort_order = category.sort_order;
  }
});

const submitForm = async () => {
  const { valid } = await form.value.validate();
  if (!valid) return;

  await store.UpdateData(id, {
    parent_id: request.value.parent_id,
    name: request.value.name,
    sort_order: request.value.sort_order ?? undefined,
  });
};
</script>

<template>
  <section class="pa-6">
    <v-card elevation="0" class="pa-6">
      <GlobalTextTitleLine title="ແກ້ໄຂໝວດໝູ່ສິນຄ້າ" class="mb-8">
        <template v-if="permission.can_update" #actions>
          <v-btn color="primary" flat type="submit" form="category-edit-form" :loading="loading"
            >ບັນທຶກ</v-btn
          >
        </template>
      </GlobalTextTitleLine>

      <GlobalPermissionDenied v-if="!permission.can_update" />

      <v-form v-else id="category-edit-form" ref="form" @submit.prevent="submitForm">
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

            <label class="d-block mb-2">ໝວດໝູ່ແມ່ / Parent category</label>
            <v-autocomplete
              :items="parentOptions"
              :loading="categoryOptionsLoading"
              v-model.number="request.parent_id"
              item-title="name"
              item-value="id"
              clearable
              density="compact"
              variant="outlined"
              hide-details="auto"
            ></v-autocomplete>
          </v-col>

          <v-col cols="12" md="6">
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
