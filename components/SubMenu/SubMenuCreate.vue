<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { UseSubMenuStore } from "@/stores/submenu";
import { UseMainMenuStore } from "@/stores/mainmenu";

const store = UseSubMenuStore();
const mainMenuStore = UseMainMenuStore();
const permission = UsePagePermission();

const loading = computed(() => store.loading || mainMenuStore.loading);
const form = ref();

// ດຶງ List ຂອງ Main Menu ມາໃຊ້ໃນ Dropdown
const mainMenuItems = computed(() => mainMenuStore.response_query_data?.list_data ?? []);

onMounted(async () => {
  // Fetch ຂໍ້ມູນ Main Menu ມາໃສ່ Dropdown
  await mainMenuStore.GetListData();
});

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
            <!-- Dropdown ເລືອກ Main Menu -->
            <label class="d-block mb-2">ເລືອກເມນູຫຼັກ / Main Menu</label>
            <v-autocomplete
              v-model="request.main_menu_id"
              :items="mainMenuItems"
              item-title="menu_name"
              item-value="id"
              placeholder="-- ເລືອກເມນູຫຼັກ --"
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
          </v-col> <!-- 🟢 ແກ້ໄຂບ່ອນນີ້ຈາກ </col> ເປັນ </v-col> -->

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