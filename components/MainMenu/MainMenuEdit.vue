<script lang="ts" setup>
import { useRoute } from "vue-router";
import { UseMainMenuStore } from "@/stores/mainmenu";

const route = useRoute();
const id = route.query.id as string;
const store = UseMainMenuStore();
const loading = computed(() => store.loading);
const form = ref();

const request = ref({
  module_id: null as number | null,
  menu_name: "",
  icon_class: "",
});

onMounted(async () => {
  await store.GetDetailData(id);
  const menu = store.response_detail_query_data;
  if (menu) {
    request.value.module_id = menu.module_id;
    request.value.menu_name = menu.menu_name;
    request.value.icon_class = menu.icon_class;
  }
});

const submitForm = async () => {
  const { valid } = await form.value.validate();
  if (!valid) return;

  await store.UpdateData(id, { ...request.value });
};
</script>

<template>
  <section class="pa-6">
    <v-card elevation="0" class="pa-6">
      <GlobalTextTitleLine title="ແກ້ໄຂເມນູຫຼັກ" class="mb-8">
        <template #actions>
          <v-btn
            color="primary"
            flat
            type="submit"
            form="main-menu-edit-form"
            :loading="loading"
            >ບັນທຶກ</v-btn
          >
        </template>
      </GlobalTextTitleLine>

      <v-form id="main-menu-edit-form" ref="form" @submit.prevent="submitForm">
        <v-row>
          <v-col cols="12" md="4">
            <label class="d-block mb-2">Module ID</label>
            <v-text-field
              v-model.number="request.module_id"
              type="number"
              density="compact"
              variant="outlined"
              hide-details="auto"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="4">
            <label class="d-block mb-2">ຊື່ເມນູ / Menu name</label>
            <v-text-field
              v-model="request.menu_name"
              :rules="[(v: string) => !!v || 'ກະລຸນາປ້ອນຊື່ເມນູ']"
              density="compact"
              variant="outlined"
              hide-details="auto"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="4">
            <label class="d-block mb-2">Icon class</label>
            <v-text-field
              v-model="request.icon_class"
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
