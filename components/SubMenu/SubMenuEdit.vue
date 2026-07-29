<script lang="ts" setup>
import { useRoute } from "vue-router";
import { UseSubMenuStore } from "@/stores/submenu";
import { UseMainMenuStore } from "@/stores/mainmenu";

const route = useRoute();
const id = route.query.id as string;
const store = UseSubMenuStore();
const mainMenuStore = UseMainMenuStore();
const permission = UsePagePermission();
const loading = computed(() => store.loading);
const form = ref();
const mainMenuOptionsLoading = computed(() => mainMenuStore.main_menu_options_loading);

const request = ref({
  main_menu_id: null as number | null,
  submenu_name: "",
  route_path: "",
});

onMounted(async () => {
  mainMenuStore.GetMainMenuOptions();

  await store.GetDetailData(id);
  const submenu = store.response_detail_query_data;
  if (submenu) {
    request.value.main_menu_id = submenu.main_menu_id;
    request.value.submenu_name = submenu.submenu_name;
    request.value.route_path = submenu.route_path;
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
      <GlobalTextTitleLine title="ແກ້ໄຂເມນູຍ່ອຍ" class="mb-8">
        <template v-if="permission.can_update" #actions>
          <v-btn color="primary" flat type="submit" form="sub-menu-edit-form" :loading="loading"
            >ບັນທຶກ</v-btn
          >
        </template>
      </GlobalTextTitleLine>

      <GlobalPermissionDenied v-if="!permission.can_update" />

      <v-form v-else id="sub-menu-edit-form" ref="form" @submit.prevent="submitForm">
        <v-row>
          <v-col cols="12" md="6">
            <label class="d-block mb-2">ເມນູຫຼັກ / Main Menu</label>
            <v-autocomplete
              v-model="request.main_menu_id"
              :items="mainMenuStore.main_menu_options"
              :loading="mainMenuOptionsLoading"
              item-title="menu_name"
              item-value="id"
              :rules="[(v: number) => !!v || 'ກະລຸນາເລືອກເມນູຫຼັກ']"
              density="compact"
              variant="outlined"
              hide-details="auto"
              class="mb-6"
              clearable
            ></v-autocomplete>

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
