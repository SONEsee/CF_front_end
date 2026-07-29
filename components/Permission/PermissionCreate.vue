<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { UsePermissionStore } from "@/stores/permission";
import { UseRoleStore } from "@/stores/role";
import { UseSubMenuStore } from "@/stores/submenu";

const store = UsePermissionStore();
const permission = UsePagePermission();
const loading = computed(() => store.loading);
const form = ref();

const request = ref({
  role_id: null as number | null,
  submenu_id: null as number | null,
  can_view: true,
  can_create: false,
  can_update: false,
  can_delete: false,
});

onMounted(() => {
  roleStore.GetRoleOptions();
  submenuStore.GetSubMenuOptions();
});

const submitForm = async () => {
  const { valid } = await form.value.validate();
  if (!valid) return;

  await store.CreateData({
    role_id: request.value.role_id as number,
    submenu_id: request.value.submenu_id as number,
    can_view: request.value.can_view,
    can_create: request.value.can_create,
    can_update: request.value.can_update,
    can_delete: request.value.can_delete,
  });
};
</script>

<template>
  <section class="pa-6">
    <v-card elevation="0" class="pa-6">
      <GlobalTextTitleLine title="ເພີ່ມສິດອະນຸຍາດ" class="mb-8">
        <template v-if="permission.can_create" #actions>
          <v-btn color="primary" flat type="submit" form="permission-create-form" :loading="loading"
            >ບັນທຶກ</v-btn
          >
        </template>
      </GlobalTextTitleLine>

      <GlobalPermissionDenied v-if="!permission.can_create" />

      <v-form v-else id="permission-create-form" ref="form" @submit.prevent="submitForm">
        <v-row>
          <v-col cols="12" md="6">
            <label class="d-block mb-2">Role ID</label>
            <v-text-field
              v-model.number="request.role_id"
              type="number"
              :rules="[(v: number) => !!v || 'ກະລຸນາປ້ອນ Role ID']"
              density="compact"
              variant="outlined"
              hide-details="auto"
              class="mb-6"
            ></v-text-field>

            <label class="d-block mb-2">Submenu ID</label>
            <v-text-field
              v-model.number="request.submenu_id"
              type="number"
              :rules="[(v: number) => !!v || 'ກະລຸນາປ້ອນ Submenu ID']"
              density="compact"
              variant="outlined"
              hide-details="auto"
            ></v-text-field>
          </v-col>

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