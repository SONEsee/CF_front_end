<script lang="ts" setup>
import { UseMainMenuStore } from "@/stores/mainmenu";
import { UseModuleStore } from "@/stores/module";

const store = UseMainMenuStore();
const moduleStore = UseModuleStore();
const permission = UsePagePermission();
const loading = computed(() => store.loading);
const form = ref();
const moduleOptionsLoading = computed(() => moduleStore.module_options_loading);

const request = ref({
  module_id: null as number | null,
  menu_name: "",
  icon_class: "",
});

onMounted(() => {
  moduleStore.GetModuleOptions();
});

const submitForm = async () => {
  const { valid } = await form.value.validate();
  if (!valid) return;

  await store.CreateData({
    module_id: request.value.module_id as number,
    menu_name: request.value.menu_name,
    icon_class: request.value.icon_class || undefined,
  });
};
</script>

<template>
  <section class="pa-6">
    <v-card elevation="0" class="pa-6">
      
      <GlobalTextTitleLine title="ເພີ່ມເມນູຫຼັກ" class="mb-8">
        <template v-if="permission.can_create" #actions>
          <v-btn
            color="primary"
            flat
            type="submit"
            form="main-menu-create-form"
            :loading="loading"
            >ບັນທຶກ</v-btn
          >
        </template>
      </GlobalTextTitleLine>

      <GlobalPermissionDenied v-if="!permission.can_create" />

      <v-form v-else id="main-menu-create-form" ref="form" @submit.prevent="submitForm">
        <v-row>
          <v-col cols="12" md="4">
            <label class="d-block mb-2">ໂມດູນ / Module</label>
            <v-autocomplete
              v-model.number="request.module_id"
              :items="moduleStore.module_options"
              :loading="moduleOptionsLoading"
              item-title="module_name"
              item-value="id"
              :rules="[(v: number) => !!v || 'ກະລຸນາເລືອກໂມດູນ']"
              placeholder="ກະລຸນາເລືອກໂມດູນ"
              density="compact"
              variant="outlined"
              hide-details="auto"
            ></v-autocomplete>
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
              placeholder="mdi-home"
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
