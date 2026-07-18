<script lang="ts" setup>
import { useRoute } from "vue-router";
import { UsePermissionStore } from "@/stores/permission";

const route = useRoute();
const id = route.query.id as string;
const store = UsePermissionStore();
const permission = UsePagePermission();
const loading = computed(() => store.loading);
const form = ref();

const request = ref({
  can_view: true,
  can_create: false,
  can_update: false,
  can_delete: false,
});

onMounted(async () => {
  await store.GetDetailData(id);
  const permissionRow = store.response_detail_query_data;
  if (permissionRow) {
    request.value.can_view = permissionRow.can_view;
    request.value.can_create = permissionRow.can_create;
    request.value.can_update = permissionRow.can_update;
    request.value.can_delete = permissionRow.can_delete;
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
      <GlobalTextTitleLine title="ແກ້ໄຂສິດອະນຸຍາດ" class="mb-8">
        <template v-if="permission.can_update" #actions>
          <v-btn color="primary" flat type="submit" form="permission-edit-form" :loading="loading"
            >ບັນທຶກ</v-btn
          >
        </template>
      </GlobalTextTitleLine>

      <GlobalPermissionDenied v-if="!permission.can_update" />

      <v-form v-else id="permission-edit-form" ref="form" @submit.prevent="submitForm">
        <v-row>
          <v-col cols="12" md="6">
            <label class="d-block mb-2">ສິດອະນຸຍາດ / Permissions</label>
            <v-switch v-model="request.can_view" label="ອະນຸຍາດເບິ່ງ (View)" color="primary" hide-details></v-switch>
            <v-switch v-model="request.can_create" label="ອະນຸຍາດສ້າງ (Create)" color="primary" hide-details></v-switch>
            <v-switch v-model="request.can_update" label="ອະນຸຍາດແກ້ໄຂ (Update)" color="primary" hide-details></v-switch>
            <v-switch v-model="request.can_delete" label="ອະນຸຍາດລົບ (Delete)" color="primary" hide-details></v-switch>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
  </section>
</template>
