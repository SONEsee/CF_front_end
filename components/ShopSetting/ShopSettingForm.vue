<script lang="ts" setup>
import { UseShopSettingStore } from "@/stores/shopsetting";
import { UserStore } from "@/stores/user";
import { UseShopStore } from "@/stores/shop";

const shopSettingStore = UseShopSettingStore();
const userStore = UserStore();
const shopStore = UseShopStore();
const permission = UsePagePermission();
const loading = computed(() => shopSettingStore.loading);
const form = ref();
const shopIdInput = ref<number | null>(null);
const loaded = ref(false);
const shopOptionsLoading = computed(() => shopStore.shop_options_loading);

// ດຶງ shop_id ຂອງຮ້ານທີ່ຜູ້ໃຊ້ທີ່ login ຢູ່ສັງກັດ ມາໃສ່ໃຫ້ອັດຕະໂນມັດ (ບໍ່ໃຫ້ຕ້ອງພິມເອງ)
onMounted(async () => {
  shopStore.GetShopOptions();

  const currentUserId = GetCurrentUserId();
  if (!currentUserId) return;
  await userStore.GetDetailData(currentUserId);
  const shopId = userStore.response_detail_query_data?.shop_id;
  if (shopId) {
    shopIdInput.value = shopId;
    await loadSetting();
  }
});

const businessHoursRule = (v: string) => {
  if (!v) return true;
  try {
    JSON.parse(v);
    return true;
  } catch {
    return "ຮູບແບບ JSON ບໍ່ຖືກຕ້ອງ";
  }
};

// ເບິ່ງ vs ແກ້ໄຂ ແມ່ນສິດຄົນລະອັນ — can_view ຄວບຄຸມການສະແດງຂໍ້ມູນ, canSubmit ຄວບຄຸມການແກ້ໄຂ/ບັນທຶກ
const canView = computed(() => permission.value.can_view);

// upsert: create-or-update, so the needed permission depends on whether the row already exists
const canSubmit = computed(() =>
  shopSettingStore.exists ? permission.value.can_update : permission.value.can_create
);

const request = ref({
  currency: "",
  vat_rate: 0,
  auto_reply_msg: "",
  business_hours: "",
});

const loadSetting = async () => {
  if (!shopIdInput.value) return;
  await shopSettingStore.GetDetailData(shopIdInput.value);
  const setting = shopSettingStore.response_detail_query_data;
  if (setting) {
    request.value.currency = setting.currency;
    request.value.vat_rate = setting.vat_rate;
    request.value.auto_reply_msg = setting.auto_reply_msg;
    request.value.business_hours = setting.business_hours;
  } else {
    request.value = { currency: "", vat_rate: 0, auto_reply_msg: "", business_hours: "" };
  }
  loaded.value = true;
};

const submitForm = async () => {
  if (!shopIdInput.value) return;
  if (!canSubmit.value) return;
  const { valid } = await form.value.validate();
  if (!valid) return;

  if (shopSettingStore.exists) {
    await shopSettingStore.UpdateData(shopIdInput.value, { ...request.value });
  } else {
    await shopSettingStore.CreateData({ shop_id: shopIdInput.value, ...request.value });
    shopSettingStore.exists = true;
  }
};
</script>

<template>
  <section class="pa-6">
    <v-card elevation="0" class="pa-6">
      <GlobalTextTitleLine title="ຄ່າຕັ້ງຮ້ານຄ້າ / Shop Setting" class="mb-8">
        <template v-if="loaded && canSubmit" #actions>
          <v-btn color="primary" flat type="submit" form="shop-setting-form" :loading="loading"
            >ບັນທຶກ</v-btn
          >
        </template>
      </GlobalTextTitleLine>

      <div class="d-flex flex-wrap align-end ga-4" :class="loaded ? 'mb-8' : ''" style="max-width: 360px">
        <v-autocomplete
          v-model.number="shopIdInput"
          :items="shopStore.shop_options"
          :loading="shopOptionsLoading"
          item-title="shop_name"
          item-value="id"
          label="ຮ້ານຄ້າ / Shop"
          density="compact"
          variant="outlined"
          hide-details="auto"
        ></v-autocomplete>
        <v-btn color="primary" :loading="loading" @click="loadSetting">ໂຫລດ</v-btn>
      </div>

      <v-divider v-if="loaded" class="mb-8"></v-divider>

      <GlobalPermissionDenied v-if="loaded && !canView" />

      <v-form v-else-if="loaded" id="shop-setting-form" ref="form" @submit.prevent="submitForm">
        <v-row>
          <v-col cols="12" md="4">
            <label class="d-block mb-2">ສະກຸນເງິນ / Currency (3 letters)</label>
            <v-text-field
              v-model="request.currency"
              placeholder="LAK"
              maxlength="3"
              :readonly="!canSubmit"
              density="compact"
              variant="outlined"
              hide-details="auto"
              class="mb-6"
            ></v-text-field>

            <label class="d-block mb-2">ອັດຕາ VAT / VAT rate</label>
            <v-text-field
              v-model.number="request.vat_rate"
              type="number"
              step="0.01"
              min="0"
              max="999.99"
              :readonly="!canSubmit"
              :rules="[(v: number) => v <= 999.99 || 'ຄ່າສູງສຸດແມ່ນ 999.99']"
              density="compact"
              variant="outlined"
              hide-details="auto"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="4">
            <label class="d-block mb-2">ຂໍ້ຄວາມຕອບກັບອັດຕະໂນມັດ / Auto reply message</label>
            <v-textarea
              v-model="request.auto_reply_msg"
              :readonly="!canSubmit"
              density="compact"
              variant="outlined"
              hide-details="auto"
            ></v-textarea>
          </v-col>

          <v-col cols="12" md="4">
            <label class="d-block mb-2">ເວລາເປີດຮ້ານ / Business hours (JSON)</label>
            <v-textarea
              v-model="request.business_hours"
              placeholder='{"mon-fri":"08:00-18:00"}'
              :readonly="!canSubmit"
              :rules="[businessHoursRule]"
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
