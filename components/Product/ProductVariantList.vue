<script lang="ts" setup>
import { UseProductVariantStore } from "@/stores/productVariant";

const props = defineProps<{ productId: number }>();

const store = UseProductVariantStore();
const permission = UsePagePermission();

const response = computed(() => store.response_query_data);
const isDialogOpen = ref(false);
const editingId = ref<number | null>(null);
const form = ref();

const emptyForm = () => ({
  variant_name: "",
  sku_code: "",
  cf_code: "",
  barcode: "",
  price: 0,
  cost_price: 0,
  weight_grams: 0,
  is_active: true,
});
const request = ref(emptyForm());

onMounted(async () => {
  store.request_query_data.product_id = props.productId;
  await store.GetListData();
});

const headers = ref([
  { title: "ຊື່ຕົວເລືອກ", key: "variant_name", sortable: false },
  { title: "SKU", key: "sku_code", sortable: false },
  { title: "CF Code", key: "cf_code", sortable: false },
  { title: "ລາຄາ", key: "price", sortable: false },
  { title: "ຕົ້ນທຶນ", key: "cost_price", sortable: false },
  { title: "ນ້ຳໜັກ (g)", key: "weight_grams", sortable: false },
  { title: "ສະຖານະ", key: "is_active", sortable: false },
  { title: "Actions", key: "actions", sortable: false },
]);

const openCreateDialog = () => {
  editingId.value = null;
  request.value = emptyForm();
  isDialogOpen.value = true;
};

const openEditDialog = (item: any) => {
  editingId.value = item.id;
  request.value = {
    variant_name: item.variant_name,
    sku_code: item.sku_code,
    cf_code: item.cf_code ?? "",
    barcode: item.barcode ?? "",
    price: item.price,
    cost_price: item.cost_price,
    weight_grams: item.weight_grams,
    is_active: item.is_active,
  };
  isDialogOpen.value = true;
};

const submitForm = async () => {
  const { valid } = await form.value.validate();
  if (!valid) return;

  let ok = false;
  if (editingId.value) {
    ok = await store.UpdateData(editingId.value, { ...request.value });
  } else {
    ok = await store.CreateData({ product_id: props.productId, ...request.value });
  }
  if (ok) isDialogOpen.value = false;
};
</script>

<template>
  <div>
    <div class="d-flex justify-space-between align-center mb-4">
      <div class="text-subtitle-1">ຕົວເລືອກສິນຄ້າ (SKU / ລາຄາ / CF Code)</div>
      <v-btn v-if="permission.can_create" color="primary" elevation="0" @click="openCreateDialog">
        <v-icon class="mr-2">mdi-plus</v-icon>
        ເພີ່ມຕົວເລືອກ
      </v-btn>
    </div>

    <v-data-table
      :headers="headers"
      :items="response?.list_data ?? []"
      :loading="store.request_query_data.loading"
      mobile-breakpoint="sm"
    >
      <template v-slot:item.is_active="{ item }">
        <v-chip v-if="item.is_active" color="info" size="small">ເປີດໃຊ້ງານ</v-chip>
        <v-chip v-else color="error" size="small">ປິດໃຊ້ງານ</v-chip>
      </template>

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
          v-if="permission.can_delete"
          color="error"
          icon="mdi-cancel"
          variant="text"
          size="small"
          @click="store.DeactivateData(item.id)"
        ></v-btn>
      </template>

      <template v-slot:no-data>
        <div class="text-center py-8 text-grey">ຍັງບໍ່ມີຕົວເລືອກສິນຄ້າ</div>
      </template>
    </v-data-table>

    <v-dialog v-model="isDialogOpen" max-width="600px">
      <v-card rounded="lg">
        <v-card-title class="text-h6 font-weight-bold">
          {{ editingId ? "ແກ້ໄຂຕົວເລືອກສິນຄ້າ" : "ເພີ່ມຕົວເລືອກສິນຄ້າ" }}
        </v-card-title>
        <v-card-text>
          <v-form ref="form" @submit.prevent="submitForm">
            <v-row>
              <v-col cols="12" md="6">
                <label class="d-block mb-2">ຊື່ຕົວເລືອກ</label>
                <v-text-field
                  v-model="request.variant_name"
                  :rules="[(v: string) => !!v || 'ກະລຸນາປ້ອນຊື່ຕົວເລືອກ']"
                  density="compact"
                  variant="outlined"
                  hide-details="auto"
                  class="mb-4"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <label class="d-block mb-2">SKU Code</label>
                <v-text-field
                  v-model="request.sku_code"
                  :rules="[(v: string) => !!v || 'ກະລຸນາປ້ອນ SKU']"
                  density="compact"
                  variant="outlined"
                  hide-details="auto"
                  class="mb-4"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <label class="d-block mb-2">
                  CF Code
                  <span class="text-caption text-grey">(ໃຊ້ຈັບຄູ່ຄອມເມັນ CF-code ອັດຕະໂນມັດ)</span>
                </label>
                <v-text-field
                  v-model="request.cf_code"
                  density="compact"
                  variant="outlined"
                  hide-details="auto"
                  class="mb-4"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <label class="d-block mb-2">Barcode</label>
                <v-text-field
                  v-model="request.barcode"
                  density="compact"
                  variant="outlined"
                  hide-details="auto"
                  class="mb-4"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <label class="d-block mb-2">ລາຄາ</label>
                <v-text-field
                  v-model.number="request.price"
                  type="number"
                  :rules="[(v: number) => v >= 0 || 'ລາຄາຕ້ອງບໍ່ຕິດລົບ']"
                  density="compact"
                  variant="outlined"
                  hide-details="auto"
                  class="mb-4"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <label class="d-block mb-2">ຕົ້ນທຶນ</label>
                <v-text-field
                  v-model.number="request.cost_price"
                  type="number"
                  density="compact"
                  variant="outlined"
                  hide-details="auto"
                  class="mb-4"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <label class="d-block mb-2">ນ້ຳໜັກ (g)</label>
                <v-text-field
                  v-model.number="request.weight_grams"
                  type="number"
                  density="compact"
                  variant="outlined"
                  hide-details="auto"
                  class="mb-4"
                ></v-text-field>
              </v-col>
              <v-col cols="12" v-if="editingId">
                <v-switch v-model="request.is_active" label="ເປີດໃຊ້ງານ" color="primary"></v-switch>
              </v-col>
            </v-row>
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
