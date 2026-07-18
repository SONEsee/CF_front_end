<script lang="ts" setup>
import { useRoute } from "vue-router";
import { UseRoleStore } from "@/stores/role";

const route = useRoute();
const id = route.query.id as string;
const store = UseRoleStore();
const permission = UsePagePermission();
const loading = computed(() => store.loading);
const form = ref();

const request = ref({
  shop_id: null as number | null,
  role_name: "",
  description: "",
});

onMounted(async () => {
  await store.GetDetailData(id);
  const role = store.response_detail_query_data;
  if (role) {
    request.value.shop_id = role.shop_id;
    request.value.role_name = role.role_name;
    request.value.description = role.description;
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
      <GlobalTextTitleLine title="ແກ້ໄຂສິດການນຳໃຊ້" class="mb-8">
        <template v-if="permission.can_update" #actions>
          <v-btn color="primary" flat type="submit" form="role-edit-form" :loading="loading"
            >ບັນທຶກ</v-btn
          >
        </template>
      </GlobalTextTitleLine>

      <GlobalPermissionDenied v-if="!permission.can_update" />

      <v-form v-else id="role-edit-form" ref="form" @submit.prevent="submitForm">
        <v-row>
          <v-col cols="12" md="6">
            <label class="d-block mb-2">ຊື່ສິດການນຳໃຊ້ / Role name</label>
            <v-text-field
              v-model="request.role_name"
              :rules="[(v: string) => !!v || 'ກະລຸນາປ້ອນຊື່ສິດການນຳໃຊ້']"
              density="compact"
              variant="outlined"
              hide-details="auto"
              class="mb-6"
            ></v-text-field>

            <label class="d-block mb-2">Shop ID</label>
            <v-text-field
              v-model.number="request.shop_id"
              type="number"
              density="compact"
              variant="outlined"
              hide-details="auto"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <label class="d-block mb-2">ລາຍລະອຽດ / Description</label>
            <v-textarea
              v-model="request.description"
              density="compact"
              variant="outlined"
              hide-details="auto"
            ></v-textarea>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
  </section>
</template>
