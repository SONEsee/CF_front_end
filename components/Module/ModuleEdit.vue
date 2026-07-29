<script lang="ts" setup>
import { useRoute } from "vue-router";
import { UseModuleStore } from "@/stores/module";

const route = useRoute();
const id = route.query.id as string;
const store = UseModuleStore();
const permission = UsePagePermission();
const loading = computed(() => store.loading);
const form = ref();

const request = ref({
  module_name: "",
  display_order: 0 as number | null,
});

onMounted(async () => {
  await store.GetDetailData(id);
  const module = store.response_detail_query_data;
  if (module) {
    request.value.module_name = module.module_name;
    request.value.display_order = module.display_order;
  }
});

const submitForm = async () => {
  const { valid } = await form.value.validate();
  if (!valid) return;

  await store.UpdateData(id, {
    module_name: request.value.module_name,
    display_order: request.value.display_order ?? undefined,
  });
};
</script>

<template>
  <section class="pa-6">
    <v-card elevation="0" class="pa-6">
      <GlobalTextTitleLine title="ແກ້ໄຂໂມດູນ" class="mb-8">
        <template v-if="permission.can_update" #actions>
          <v-btn
            color="primary"
            flat
            type="submit"
            form="module-edit-form"
            :loading="loading"
            >ບັນທຶກ</v-btn
          >
        </template>
      </GlobalTextTitleLine>

      <GlobalPermissionDenied v-if="!permission.can_update" />

      <v-form v-else id="module-edit-form" ref="form" @submit.prevent="submitForm">
        <v-row>
          <v-col cols="12" md="6">
            <label class="d-block mb-2">ຊື່ໂມດູນ / Module name</label>
            <v-text-field
              v-model="request.module_name"
              :rules="[(v: string) => !!v || 'ກະລຸນາປ້ອນຊື່ໂມດູນ']"
              density="compact"
              variant="outlined"
              hide-details="auto"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <label class="d-block mb-2">ລຳດັບສະແດງ / Display order</label>
            <v-text-field
              v-model.number="request.display_order"
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
