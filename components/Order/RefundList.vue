<script lang="ts" setup>
import { UseRefundStore } from "@/stores/refund";

const props = defineProps<{ orderId: number }>();

const store = UseRefundStore();
const permission = UsePagePermission();

const response = computed(() => store.response_query_data);
const isDialogOpen = ref(false);
const form = ref();

const request = ref({
  reason: "",
  refund_amount: 0,
});

onMounted(async () => {
  store.request_query_data.order_id = props.orderId;
  await store.GetListData();
});

const headers = ref([
  { title: "ເຫດຜົນ", key: "reason", sortable: false },
  { title: "ຍອດຄືນເງິນ", key: "refund_amount", sortable: false },
  { title: "ສະຖານະ", key: "status", sortable: false },
  { title: "ວັນທີ່ສ້າງ", key: "created_at", sortable: false },
  { title: "Actions", key: "actions", sortable: false },
]);

const formatNumber = (num: number) => new Intl.NumberFormat().format(num);

const openCreateDialog = () => {
  request.value = { reason: "", refund_amount: 0 };
  isDialogOpen.value = true;
};

const submitForm = async () => {
  const { valid } = await form.value.validate();
  if (!valid) return;
  const ok = await store.CreateData({
    order_id: props.orderId,
    reason: request.value.reason || undefined,
    refund_amount: request.value.refund_amount,
  });
  if (ok) isDialogOpen.value = false;
};

const statusColor = (status: string) => {
  if (status === "DONE") return "info";
  if (status === "REJECTED") return "error";
  return "warning";
};
</script>

<template>
  <div>
    <div class="d-flex justify-space-between align-center mb-4">
      <div class="text-subtitle-1">ຄຳຮ້ອງຄືນເງິນ</div>
      <v-btn v-if="permission.can_create" color="primary" elevation="0" @click="openCreateDialog">
        <v-icon class="mr-2">mdi-plus</v-icon>
        ສ້າງຄຳຮ້ອງຄືນເງິນ
      </v-btn>
    </div>

    <v-data-table
      :headers="headers"
      :items="response?.list_data ?? []"
      :loading="store.request_query_data.loading"
      mobile-breakpoint="sm"
    >
      <template v-slot:item.reason="{ item }">{{ item.reason || "-" }}</template>
      <template v-slot:item.refund_amount="{ item }">{{ formatNumber(item.refund_amount) }}</template>

      <template v-slot:item.status="{ item }">
        <v-chip :color="statusColor(item.status)" size="small">{{ item.status }}</v-chip>
      </template>

      <template v-slot:item.created_at="{ item }">{{ new Date(item.created_at).toLocaleDateString() }}</template>

      <template v-slot:item.actions="{ item }">
        <v-menu v-if="permission.can_update && item.status === 'REQUESTED'">
          <template v-slot:activator="{ props: menuProps }">
            <v-btn color="secondary" size="small" variant="text" v-bind="menuProps">ດຳເນີນການ</v-btn>
          </template>
          <v-list>
            <v-list-item @click="store.UpdateStatus(item.id, 'APPROVED')">
              <v-list-item-title>ອະນຸມັດ</v-list-item-title>
            </v-list-item>
            <v-list-item @click="store.UpdateStatus(item.id, 'REJECTED')">
              <v-list-item-title>ປະຕິເສດ</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-btn
          v-if="permission.can_update && item.status === 'APPROVED'"
          color="info"
          size="small"
          variant="text"
          @click="store.UpdateStatus(item.id, 'DONE')"
        >
          ຄືນເງິນແລ້ວ
        </v-btn>
      </template>

      <template v-slot:no-data>
        <div class="text-center py-8 text-grey">ຍັງບໍ່ມີຄຳຮ້ອງຄືນເງິນ</div>
      </template>
    </v-data-table>

    <v-dialog v-model="isDialogOpen" max-width="500px">
      <v-card rounded="lg">
        <v-card-title class="text-h6 font-weight-bold">ສ້າງຄຳຮ້ອງຄືນເງິນ</v-card-title>
        <v-card-text>
          <v-form ref="form" @submit.prevent="submitForm">
            <label class="d-block mb-2">ເຫດຜົນ</label>
            <v-textarea
              v-model="request.reason"
              density="compact"
              variant="outlined"
              hide-details="auto"
              class="mb-4"
            ></v-textarea>

            <label class="d-block mb-2">ຍອດຄືນເງິນ</label>
            <v-text-field
              v-model.number="request.refund_amount"
              type="number"
              :rules="[(v: number) => v > 0 || 'ຕ້ອງຫຼາຍກວ່າ 0']"
              density="compact"
              variant="outlined"
              hide-details="auto"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" @click="isDialogOpen = false">ຍົກເລີກ</v-btn>
          <v-btn color="primary" variant="tonal" :loading="store.loading" @click="submitForm">ບັນທຶກ</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
