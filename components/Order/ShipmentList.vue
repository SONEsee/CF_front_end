<script lang="ts" setup>
import { UseShipmentStore } from "@/stores/shipment";

const props = defineProps<{ orderId: number }>();

const store = UseShipmentStore();
const permission = UsePagePermission();

const response = computed(() => store.response_query_data);
const isDialogOpen = ref(false);
const editingId = ref<number | null>(null);
const form = ref();

const request = ref({
  courier_name: "",
  tracking_number: "",
});

onMounted(async () => {
  store.request_query_data.order_id = props.orderId;
  await store.GetListData();
});

const headers = ref([
  { title: "ຜູ້ຂົນສົ່ງ", key: "courier_name", sortable: false },
  { title: "ເລກຕິດຕາມ", key: "tracking_number", sortable: false },
  { title: "ສະຖານະ", key: "shipping_status", sortable: false },
  { title: "ວັນທີ່ສົ່ງ", key: "shipped_at", sortable: false },
  { title: "ວັນທີ່ຮອດ", key: "delivered_at", sortable: false },
  { title: "Actions", key: "actions", sortable: false },
]);

const openCreateDialog = () => {
  editingId.value = null;
  request.value = { courier_name: "", tracking_number: "" };
  isDialogOpen.value = true;
};

const openEditDialog = (item: any) => {
  editingId.value = item.id;
  request.value = { courier_name: item.courier_name ?? "", tracking_number: item.tracking_number ?? "" };
  isDialogOpen.value = true;
};

const submitForm = async () => {
  let ok = false;
  if (editingId.value) {
    ok = await store.UpdateData(editingId.value, { ...request.value });
  } else {
    ok = await store.CreateData({ order_id: props.orderId, ...request.value });
  }
  if (ok) isDialogOpen.value = false;
};

const statusColor = (status: string) => {
  if (status === "DELIVERED") return "info";
  if (status === "PICKED_UP") return "secondary";
  return "warning";
};
</script>

<template>
  <div>
    <div class="d-flex justify-space-between align-center mb-4">
      <div class="text-subtitle-1">ການຈັດສົ່ງ</div>
      <v-btn v-if="permission.can_create" color="primary" elevation="0" @click="openCreateDialog">
        <v-icon class="mr-2">mdi-plus</v-icon>
        ບັນທຶກການຈັດສົ່ງ
      </v-btn>
    </div>

    <v-data-table
      :headers="headers"
      :items="response?.list_data ?? []"
      :loading="store.request_query_data.loading"
      mobile-breakpoint="sm"
    >
      <template v-slot:item.courier_name="{ item }">{{ item.courier_name || "-" }}</template>
      <template v-slot:item.tracking_number="{ item }">{{ item.tracking_number || "-" }}</template>

      <template v-slot:item.shipping_status="{ item }">
        <v-chip :color="statusColor(item.shipping_status)" size="small">{{ item.shipping_status }}</v-chip>
      </template>

      <template v-slot:item.shipped_at="{ item }">{{ item.shipped_at ? new Date(item.shipped_at).toLocaleDateString() : "-" }}</template>
      <template v-slot:item.delivered_at="{ item }">{{ item.delivered_at ? new Date(item.delivered_at).toLocaleDateString() : "-" }}</template>

      <template v-slot:item.actions="{ item }">
        <v-btn
          v-if="permission.can_update"
          color="primary"
          icon="mdi-pencil"
          variant="text"
          size="small"
          @click="openEditDialog(item)"
        ></v-btn>
        <v-btn
          v-if="permission.can_update && item.shipping_status === 'PENDING'"
          color="secondary"
          size="small"
          variant="text"
          @click="store.UpdateStatus(item.id, 'PICKED_UP')"
        >
          ຮັບເອົາແລ້ວ
        </v-btn>
        <v-btn
          v-if="permission.can_update && item.shipping_status === 'PICKED_UP'"
          color="info"
          size="small"
          variant="text"
          @click="store.UpdateStatus(item.id, 'DELIVERED')"
        >
          ຮອດແລ້ວ
        </v-btn>
      </template>

      <template v-slot:no-data>
        <div class="text-center py-8 text-grey">ຍັງບໍ່ມີການຈັດສົ່ງ</div>
      </template>
    </v-data-table>

    <v-dialog v-model="isDialogOpen" max-width="500px">
      <v-card rounded="lg">
        <v-card-title class="text-h6 font-weight-bold">
          {{ editingId ? "ແກ້ໄຂການຈັດສົ່ງ" : "ບັນທຶກການຈັດສົ່ງ" }}
        </v-card-title>
        <v-card-text>
          <v-form ref="form" @submit.prevent="submitForm">
            <label class="d-block mb-2">ຜູ້ຂົນສົ່ງ</label>
            <v-text-field
              v-model="request.courier_name"
              density="compact"
              variant="outlined"
              hide-details="auto"
              class="mb-4"
            ></v-text-field>

            <label class="d-block mb-2">ເລກຕິດຕາມ</label>
            <v-text-field
              v-model="request.tracking_number"
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
