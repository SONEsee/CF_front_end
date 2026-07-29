<script lang="ts" setup>
import { UseCustomerAddressStore } from "@/stores/customerAddress";
import { UseLaoLocationStore } from "@/stores/laoLocation";

const props = defineProps<{ customerId: number }>();

const store = UseCustomerAddressStore();
const locationStore = UseLaoLocationStore();
const permission = UsePagePermission();

const response = computed(() => store.response_query_data);
const isDialogOpen = ref(false);
const editingId = ref<number | null>(null);
const form = ref();

// id ຂອງ dropdown ທີ່ເລືອກ (cascading) — ບໍ່ແມ່ນຄ່າທີ່ສົ່ງໄປ backend ໂດຍກົງ
// (backend ຍັງເກັບເປັນ text ຄື request.province/district/sub_district, resolve ຕອນ submit)
const selectedProvinceId = ref<number | null>(null);
const selectedDistrictId = ref<number | null>(null);
const selectedVillageId = ref<number | null>(null);

const emptyForm = () => ({
  recipient_name: "",
  phone: "",
  address: "",
  sub_district: "",
  district: "",
  province: "",
  postal_code: "",
});
const request = ref(emptyForm());

onMounted(async () => {
  store.request_query_data.customer_id = props.customerId;
  locationStore.GetProvinceOptions();
  await store.GetListData();
});

const onProvinceChange = async (provinceId: number | null) => {
  selectedDistrictId.value = null;
  selectedVillageId.value = null;
  locationStore.village_options = [];
  if (provinceId) {
    await locationStore.GetDistrictOptions(provinceId);
  } else {
    locationStore.district_options = [];
  }
};

const onDistrictChange = async (districtId: number | null) => {
  selectedVillageId.value = null;
  if (districtId) {
    await locationStore.GetVillageOptions(districtId);
  } else {
    locationStore.village_options = [];
  }
};

const headers = ref([
  { title: "ຜູ້ຮັບ", key: "recipient_name", sortable: false },
  { title: "ເບີໂທ", key: "phone", sortable: false },
  { title: "ທີ່ຢູ່", key: "address", sortable: false },
  { title: "ແຂວງ/ເມືອງ", key: "province", sortable: false },
  { title: "ຫຼັກ", key: "is_default", sortable: false },
  { title: "Actions", key: "actions", sortable: false },
]);

const resetLocationSelection = () => {
  selectedProvinceId.value = null;
  selectedDistrictId.value = null;
  selectedVillageId.value = null;
  locationStore.district_options = [];
  locationStore.village_options = [];
};

const openCreateDialog = () => {
  editingId.value = null;
  request.value = emptyForm();
  resetLocationSelection();
  isDialogOpen.value = true;
};

// reverse-lookup: address ເກົ່າເກັບເປັນ text (province/district/sub_district) — ຫາ id
// ທີ່ຊື່ກົງກັນເພື່ອ pre-fill dropdown. ຖ້າຫາບໍ່ພົບ (ຂໍ້ມູນເກົ່າ/ພິມຜິດມາດຕະຖານ) ປ່ອຍວ່າງ
const openEditDialog = async (item: any) => {
  editingId.value = item.id;
  request.value = {
    recipient_name: item.recipient_name ?? "",
    phone: item.phone ?? "",
    address: item.address ?? "",
    sub_district: item.sub_district ?? "",
    district: item.district ?? "",
    province: item.province ?? "",
    postal_code: item.postal_code ?? "",
  };
  resetLocationSelection();
  isDialogOpen.value = true;

  await locationStore.GetProvinceOptions();
  const province = locationStore.province_options.find((p) => p.name === item.province);
  if (!province) return;
  selectedProvinceId.value = province.id;

  await locationStore.GetDistrictOptions(province.id);
  const district = locationStore.district_options.find((d) => d.name === item.district);
  if (!district) return;
  selectedDistrictId.value = district.id;

  await locationStore.GetVillageOptions(district.id);
  const village = locationStore.village_options.find((v) => v.name === item.sub_district);
  if (!village) return;
  selectedVillageId.value = village.id;
};

const submitForm = async () => {
  const { valid } = await form.value.validate();
  if (!valid) return;

  // resolve id ທີ່ເລືອກໃນ dropdown ກັບເປັນຊື່ text ກ່ອນສົ່ງ (backend ຍັງເກັບ text ຄືເກົ່າ)
  const payload = {
    ...request.value,
    province:
      locationStore.province_options.find((p) => p.id === selectedProvinceId.value)?.name ??
      request.value.province,
    district:
      locationStore.district_options.find((d) => d.id === selectedDistrictId.value)?.name ??
      request.value.district,
    sub_district:
      locationStore.village_options.find((v) => v.id === selectedVillageId.value)?.name ??
      request.value.sub_district,
  };

  let ok = false;
  if (editingId.value) {
    ok = await store.UpdateData(editingId.value, payload);
  } else {
    ok = await store.CreateData({ customer_id: props.customerId, ...payload });
  }
  if (ok) isDialogOpen.value = false;
};
</script>

<template>
  <div>
    <div class="d-flex justify-space-between align-center mb-4">
      <div class="text-subtitle-1">ທີ່ຢູ່ຈັດສົ່ງ</div>
      <v-btn v-if="permission.can_create" color="primary" elevation="0" @click="openCreateDialog">
        <v-icon class="mr-2">mdi-plus</v-icon>
        ເພີ່ມທີ່ຢູ່
      </v-btn>
    </div>

    <v-data-table
      :headers="headers"
      :items="response?.list_data ?? []"
      :loading="store.request_query_data.loading"
      mobile-breakpoint="sm"
    >
      <template v-slot:item.recipient_name="{ item }">{{ item.recipient_name || "-" }}</template>
      <template v-slot:item.phone="{ item }">{{ item.phone || "-" }}</template>
      <template v-slot:item.address="{ item }">{{ item.address || "-" }}</template>
      <template v-slot:item.province="{ item }">{{ item.province || "-" }}</template>

      <template v-slot:item.is_default="{ item }">
        <v-chip v-if="item.is_default" color="info" size="small">ຫຼັກ</v-chip>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-btn
          v-if="permission.can_update && !item.is_default"
          color="secondary"
          size="small"
          variant="text"
          @click="store.SetDefault(customerId, item.id)"
        >
          ຕັ້ງເປັນຫຼັກ
        </v-btn>
        <v-btn
          v-if="permission.can_update"
          color="primary"
          icon="mdi-pencil"
          variant="text"
          size="small"
          @click="openEditDialog(item)"
        ></v-btn>
        <v-btn
          v-if="permission.can_delete && !item.is_default"
          color="error"
          icon="mdi-delete"
          variant="text"
          size="small"
          @click="store.DeleteData(item.id)"
        ></v-btn>
      </template>

      <template v-slot:no-data>
        <div class="text-center py-8 text-grey">ຍັງບໍ່ມີທີ່ຢູ່</div>
      </template>
    </v-data-table>

    <v-dialog v-model="isDialogOpen" max-width="600px">
      <v-card rounded="lg">
        <v-card-title class="text-h6 font-weight-bold">
          {{ editingId ? "ແກ້ໄຂທີ່ຢູ່" : "ເພີ່ມທີ່ຢູ່" }}
        </v-card-title>
        <v-card-text>
          <v-form ref="form" @submit.prevent="submitForm">
            <v-row>
              <v-col cols="12" md="6">
                <label class="d-block mb-2">ຜູ້ຮັບ</label>
                <v-text-field
                  v-model="request.recipient_name"
                  density="compact"
                  variant="outlined"
                  hide-details="auto"
                  class="mb-4"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <label class="d-block mb-2">ເບີໂທ</label>
                <v-text-field
                  v-model="request.phone"
                  density="compact"
                  variant="outlined"
                  hide-details="auto"
                  class="mb-4"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <label class="d-block mb-2">ທີ່ຢູ່</label>
                <v-textarea
                  v-model="request.address"
                  density="compact"
                  variant="outlined"
                  hide-details="auto"
                  class="mb-4"
                ></v-textarea>
              </v-col>
              <v-col cols="12" md="6">
                <label class="d-block mb-2">ແຂວງ</label>
                <v-autocomplete
                  v-model="selectedProvinceId"
                  :items="locationStore.province_options"
                  :loading="locationStore.province_options_loading"
                  item-title="name"
                  item-value="id"
                  clearable
                  density="compact"
                  variant="outlined"
                  hide-details="auto"
                  class="mb-4"
                  @update:model-value="onProvinceChange"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" md="6">
                <label class="d-block mb-2">ເມືອງ</label>
                <v-autocomplete
                  v-model="selectedDistrictId"
                  :items="locationStore.district_options"
                  :loading="locationStore.district_options_loading"
                  :disabled="!selectedProvinceId"
                  item-title="name"
                  item-value="id"
                  clearable
                  density="compact"
                  variant="outlined"
                  hide-details="auto"
                  class="mb-4"
                  @update:model-value="onDistrictChange"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" md="6">
                <label class="d-block mb-2">ບ້ານ</label>
                <v-autocomplete
                  v-model="selectedVillageId"
                  :items="locationStore.village_options"
                  :loading="locationStore.village_options_loading"
                  :disabled="!selectedDistrictId"
                  item-title="name"
                  item-value="id"
                  clearable
                  density="compact"
                  variant="outlined"
                  hide-details="auto"
                  class="mb-4"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" md="6">
                <label class="d-block mb-2">ລະຫັດໄປສະນີ</label>
                <v-text-field
                  v-model="request.postal_code"
                  density="compact"
                  variant="outlined"
                  hide-details="auto"
                  class="mb-4"
                ></v-text-field>
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
