<script lang="ts" setup>
import { UsePaymentStore } from "@/stores/payment";
import { UseShopBankAccountStore } from "@/stores/shopbankaccount";

const props = defineProps<{ orderId: number; shopId: number }>();

const store = UsePaymentStore();
const bankAccountStore = UseShopBankAccountStore();
const permission = UsePagePermission();

const response = computed(() => store.response_query_data);
const isCreateDialogOpen = ref(false);
const isVerifyDialogOpen = ref(false);
const verifyingId = ref<number | null>(null);
const form = ref();

const createForm = ref({
  payment_method: "SLIP" as "SLIP" | "PROMPTPAY" | "COD",
  shop_bank_account_id: null as number | null,
  bank_trans_ref_id: "",
});
const selectedFile = ref<File | null>(null);
const file = ref();

const verifyForm = ref({
  is_valid_slip: true,
  verified_amount: 0,
});

onMounted(async () => {
  store.request_query_data.order_id = props.orderId;
  bankAccountStore.request_query_data.shop_id = props.shopId;
  await Promise.all([store.GetListData(), bankAccountStore.GetListData()]);
});

const headers = ref([
  { title: "ວິທີຊຳລະ", key: "payment_method", sortable: false },
  { title: "ຢືນຢັນ", key: "is_valid_slip", sortable: false },
  { title: "ຍອດຢືນຢັນ", key: "verified_amount", sortable: false },
  { title: "ວັນທີ່ຊຳລະ", key: "paid_at", sortable: false },
  { title: "Actions", key: "actions", sortable: false },
]);

const formatNumber = (num: number) => new Intl.NumberFormat().format(num);

const openFile = () => {
  file.value.click();
};
const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  selectedFile.value = target.files?.[0] ?? null;
};

const openCreateDialog = () => {
  createForm.value = { payment_method: "SLIP", shop_bank_account_id: null, bank_trans_ref_id: "" };
  selectedFile.value = null;
  isCreateDialogOpen.value = true;
};

const submitCreate = async () => {
  const { valid } = await form.value.validate();
  if (!valid) return;

  const payload = {
    order_id: props.orderId,
    payment_method: createForm.value.payment_method,
    shop_bank_account_id: createForm.value.shop_bank_account_id ?? undefined,
    bank_trans_ref_id: createForm.value.bank_trans_ref_id || undefined,
  };

  let ok = false;
  if (createForm.value.payment_method === "SLIP" && selectedFile.value) {
    ok = await store.UploadAndCreate(selectedFile.value, payload);
  } else {
    ok = await store.CreateData(payload);
  }
  if (ok) isCreateDialogOpen.value = false;
};

const openVerifyDialog = (item: any) => {
  verifyingId.value = item.id;
  verifyForm.value = { is_valid_slip: true, verified_amount: 0 };
  isVerifyDialogOpen.value = true;
};

const submitVerify = async () => {
  if (!verifyingId.value) return;
  const ok = await store.VerifyPayment(verifyingId.value, verifyForm.value);
  if (ok) isVerifyDialogOpen.value = false;
};
</script>

<template>
  <div>
    <div class="d-flex justify-space-between align-center mb-4">
      <div class="text-subtitle-1">ການຊຳລະເງິນ</div>
      <v-btn v-if="permission.can_create" color="primary" elevation="0" @click="openCreateDialog">
        <v-icon class="mr-2">mdi-plus</v-icon>
        ບັນທຶກການຊຳລະ
      </v-btn>
    </div>

    <v-data-table
      :headers="headers"
      :items="response?.list_data ?? []"
      :loading="store.request_query_data.loading"
      mobile-breakpoint="sm"
    >
      <template v-slot:item.is_valid_slip="{ item }">
        <v-chip v-if="item.is_valid_slip === true" color="info" size="small">ຖືກຕ້ອງ</v-chip>
        <v-chip v-else-if="item.is_valid_slip === false" color="error" size="small">ບໍ່ຖືກຕ້ອງ</v-chip>
        <v-chip v-else color="warning" size="small">ລໍຖ້າກວດ</v-chip>
      </template>

      <template v-slot:item.verified_amount="{ item }">
        {{ item.verified_amount != null ? formatNumber(item.verified_amount) : "-" }}
      </template>

      <template v-slot:item.paid_at="{ item }">
        {{ item.paid_at ? new Date(item.paid_at).toLocaleString() : "-" }}
      </template>

      <template v-slot:item.actions="{ item }">
        <v-btn
          v-if="permission.can_update && item.is_valid_slip == null"
          color="secondary"
          size="small"
          variant="text"
          @click="openVerifyDialog(item)"
        >
          ຢືນຢັນ
        </v-btn>
      </template>

      <template v-slot:no-data>
        <div class="text-center py-8 text-grey">ຍັງບໍ່ມີການຊຳລະເງິນ</div>
      </template>
    </v-data-table>

    <v-dialog v-model="isCreateDialogOpen" max-width="500px">
      <v-card rounded="lg">
        <v-card-title class="text-h6 font-weight-bold">ບັນທຶກການຊຳລະ</v-card-title>
        <v-card-text>
          <v-form ref="form" @submit.prevent="submitCreate">
            <label class="d-block mb-2">ວິທີຊຳລະ</label>
            <v-select
              v-model="createForm.payment_method"
              :items="['SLIP', 'PROMPTPAY', 'COD']"
              density="compact"
              variant="outlined"
              hide-details="auto"
              class="mb-4"
            ></v-select>

            <template v-if="createForm.payment_method !== 'COD'">
              <label class="d-block mb-2">ບັນຊີທະນາຄານຮ້ານ</label>
              <v-autocomplete
                v-model.number="createForm.shop_bank_account_id"
                :items="bankAccountStore.response_query_data?.list_data ?? []"
                item-title="account_name"
                item-value="id"
                clearable
                density="compact"
                variant="outlined"
                hide-details="auto"
                class="mb-4"
              ></v-autocomplete>

              <label class="d-block mb-2">ເລກອ້າງອີງທະນາຄານ</label>
              <v-text-field
                v-model="createForm.bank_trans_ref_id"
                density="compact"
                variant="outlined"
                hide-details="auto"
                class="mb-4"
              ></v-text-field>
            </template>

            <template v-if="createForm.payment_method === 'SLIP'">
              <label class="d-block mb-2">ຮູບສະລິບ</label>
              <v-btn variant="outlined" prepend-icon="mdi-cloud-upload-outline" @click="openFile">
                {{ selectedFile ? selectedFile.name : "ເລືອກຮູບສະລິບ" }}
              </v-btn>
              <input type="file" ref="file" style="display: none" accept="image/*" @change="onFileChange" />
            </template>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" @click="isCreateDialogOpen = false">ຍົກເລີກ</v-btn>
          <v-btn color="primary" variant="tonal" :loading="store.loading" @click="submitCreate">ບັນທຶກ</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isVerifyDialogOpen" max-width="450px">
      <v-card rounded="lg">
        <v-card-title class="text-h6 font-weight-bold">ຢືນຢັນການຊຳລະ</v-card-title>
        <v-card-text>
          <v-switch v-model="verifyForm.is_valid_slip" label="ສະລິບຖືກຕ້ອງ" color="primary"></v-switch>
          <label class="d-block mb-2">ຍອດຢືນຢັນ</label>
          <v-text-field
            v-model.number="verifyForm.verified_amount"
            type="number"
            density="compact"
            variant="outlined"
            hide-details="auto"
          ></v-text-field>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" @click="isVerifyDialogOpen = false">ຍົກເລີກ</v-btn>
          <v-btn color="primary" variant="tonal" :loading="store.loading" @click="submitVerify">ຢືນຢັນ</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
