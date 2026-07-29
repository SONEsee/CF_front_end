<script lang="ts" setup>
import { UseModuleStore } from "@/stores/module";

const store = UseModuleStore();
const permission = UsePagePermission();
const loading = computed(() => store.loading);
const form = ref();

const request = ref({
  module_name: "",
});

const submitForm = async () => {
  const { valid } = await form.value.validate();
  if (!valid) return;

  await store.CreateData({
    module_name: request.value.module_name,
  });
};
</script>

<template>
  <section class="pa-6">
    <v-card elevation="0" class="pa-6">
      <GlobalTextTitleLine title="ເພີ່ມໂມດູນ" class="mb-8">
        <template v-if="permission.can_create" #actions>
          <v-btn
            color="primary"
            flat
            type="submit"
            form="module-create-form"
            :loading="loading"
            >ບັນທຶກ</v-btn
          >
        </template>
      </GlobalTextTitleLine>

      <GlobalPermissionDenied v-if="!permission.can_create" />

      <v-form v-else id="module-create-form" ref="form" @submit.prevent="submitForm">
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
        </v-row>
      </v-form>
    </v-card>
  </section>
</template>
