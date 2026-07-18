<script lang="ts" setup>
import { UseSubMenuStore } from "@/stores/submenu";

const store = UseSubMenuStore();
const permission = UsePagePermission();
const loading = computed(() => store.loading);
const form = ref();

const request = ref({
  main_menu_id: null as number | null,
  submenu_name: "",
  route_path: "",
});

const submitForm = async () => {
  const { valid } = await form.value.validate();
  if (!valid) return;

  await store.CreateData({
    main_menu_id: request.value.main_menu_id as number,
    submenu_name: request.value.submenu_name,
    route_path: request.value.route_path || undefined,
  });
};
</script>

<template>
  <section class="pa-6">
    <v-card elevation="0" class="pa-6">
      <GlobalTextTitleLine title="ເພີ່ມເມນູຍ່ອຍ" class="mb-8">
        <template v-if="permission.can_create" #actions>
          <v-btn color="primary" flat type="submit" form="sub-menu-create-form" :loading="loading"
            >ບັນທຶກ</v-btn
          >
        </template>
      </GlobalTextTitleLine>

      <GlobalPermissionDenied v-if="!permission.can_create" />

      <v-form v-else id="sub-menu-create-form" ref="form" @submit.prevent="submitForm">
        <v-row>
          <v-col cols="12" md="6">
            <label class="d-block mb-2">Main Menu ID</label>
            <v-text-field
              v-model.number="request.main_menu_id"
              type="number"
              :rules="[(v: number) => !!v || 'ກະລຸນາປ້ອນ Main Menu ID']"
              density="compact"
              variant="outlined"
              hide-details="auto"
              class="mb-6"
            ></v-text-field>

            <label class="d-block mb-2">ຊື່ເມນູຍ່ອຍ / Submenu name</label>
            <v-text-field
              v-model="request.submenu_name"
              :rules="[(v: string) => !!v || 'ກະລຸນາປ້ອນຊື່ເມນູຍ່ອຍ']"
              density="compact"
              variant="outlined"
              hide-details="auto"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <label class="d-block mb-2">Route path</label>
            <v-text-field
              v-model="request.route_path"
              placeholder="/example/path"
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
