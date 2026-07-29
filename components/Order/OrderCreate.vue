<script lang="ts" setup>
import { UseOrderStore } from "@/stores/order";
import { UseShopStore } from "@/stores/shop";
import { UseCustomerStore } from "@/stores/customer";
import { UseDiscountStore } from "@/stores/discount";
import { UseProductVariantStore } from "@/stores/productVariant";

const store = UseOrderStore();
const shopStore = UseShopStore();
const customerStore = UseCustomerStore();
const discountStore = UseDiscountStore();
const variantStore = UseProductVariantStore();
const permission = UsePagePermission();
const loading = computed(() => store.loading);
const form = ref();
const shopOptionsLoading = computed(() => shopStore.shop_options_loading);

interface LineItem {
  product_variant_id: number | null;
  variant_label: string;
  price: number;
  buy_quantity: number;
}

const shopId = ref<number | null>(null);
const customerId = ref<number | null>(null);
const discountId = ref<number | null>(null);
const shippingFee = ref(0);
const note = ref("");
const items = ref<LineItem[]>([{ product_variant_id: null, variant_label: "", price: 0, buy_quantity: 1 }]);

onMounted(() => {
  shopStore.GetShopOptions();
});

const customerOptionsLoading = computed(() => customerStore.request_query_data.loading);
// customer_name ອາດເປັນ null (ລູກຄ້າຈາກ social ທີ່ຍັງບໍ່ໄດ້ຕັ້ງຊື່) — fallback ໄປ phone/id ບໍ່ໃຫ້ແຖວຫວ່າງ
const customerOptions = computed(() =>
  (customerStore.response_query_data?.list_data ?? []).map((c) => ({
    ...c,
    display_name: c.customer_name || c.phone_number || `ລູກຄ້າ #${c.id}`,
  }))
);

const onShopChange = async (newShopId: number | null) => {
  customerId.value = null;
  discountId.value = null;
  items.value = [{ product_variant_id: null, variant_label: "", price: 0, buy_quantity: 1 }];
  if (newShopId) {
    customerStore.request_query_data.shop_id = newShopId;
    await customerStore.GetListData();
    await discountStore.GetDiscountOptionsByShop(newShopId);
  }
};

const onCustomerSearch = async (q: string) => {
  if (!shopId.value) return;
  customerStore.request_query_data.shop_id = shopId.value;
  customerStore.request_query_data.q = q || null;
  await customerStore.GetListData();
};

const onVariantSearch = async (q: string) => {
  if (!shopId.value) return;
  await variantStore.GetVariantOptionsByShop(shopId.value, q);
};

const addLine = () => {
  items.value.push({ product_variant_id: null, variant_label: "", price: 0, buy_quantity: 1 });
};

const removeLine = (index: number) => {
  if (items.value.length <= 1) return;
  items.value.splice(index, 1);
};

const onVariantSelect = (index: number, variantId: number | null) => {
  const option = variantStore.variant_options.find((v) => v.id === variantId);
  if (option) {
    items.value[index].price = option.price;
    items.value[index].variant_label = `${option.product_name} — ${option.variant_name} (${option.sku_code})`;
  }
};

const itemsTotal = computed(() =>
  items.value.reduce((sum, line) => sum + line.price * (line.buy_quantity || 0), 0)
);

const selectedDiscount = computed(() => discountStore.discount_options.find((d) => d.id === discountId.value));

const estimatedDiscountAmount = computed(() => {
  if (!selectedDiscount.value) return 0;
  const d = selectedDiscount.value;
  if (itemsTotal.value < d.min_order) return 0;
  const amount = d.discount_type === "PERCENT" ? (itemsTotal.value * d.discount_value) / 100 : d.discount_value;
  return Math.min(amount, itemsTotal.value);
});

const estimatedNetPayable = computed(
  () => itemsTotal.value - estimatedDiscountAmount.value + (shippingFee.value || 0)
);

const formatNumber = (num: number) => new Intl.NumberFormat().format(Math.round(num));

const submitForm = async () => {
  const { valid } = await form.value.validate();
  if (!valid) return;
  if (items.value.some((line) => !line.product_variant_id)) return;

  await store.CreateOrder({
    shop_id: shopId.value as number,
    customer_id: customerId.value as number,
    discount_id: discountId.value ?? undefined,
    shipping_fee: shippingFee.value || undefined,
    note: note.value || undefined,
    items: items.value.map((line) => ({
      product_variant_id: line.product_variant_id as number,
      buy_quantity: line.buy_quantity,
    })),
  });
};
</script>

<template>
  <section class="pa-6">
    <v-card elevation="0" class="pa-6">
      <GlobalTextTitleLine title="ສ້າງອໍເດີ" class="mb-8">
        <template v-if="permission.can_create" #actions>
          <v-btn color="primary" flat type="submit" form="order-create-form" :loading="loading"
            >ບັນທຶກ</v-btn
          >
        </template>
      </GlobalTextTitleLine>

      <GlobalPermissionDenied v-if="!permission.can_create" />

      <v-form v-else id="order-create-form" ref="form" @submit.prevent="submitForm">
        <v-row>
          <v-col cols="12" md="4">
            <label class="d-block mb-2">ຮ້ານຄ້າ / Shop</label>
            <v-autocomplete
              v-model.number="shopId"
              :items="shopStore.shop_options"
              :loading="shopOptionsLoading"
              item-title="shop_name"
              item-value="id"
              :rules="[(v: number) => !!v || 'ກະລຸນາເລືອກຮ້ານຄ້າ']"
              density="compact"
              variant="outlined"
              hide-details="auto"
              @update:model-value="onShopChange"
            ></v-autocomplete>
          </v-col>

          <v-col cols="12" md="4">
            <label class="d-block mb-2">ລູກຄ້າ / Customer</label>
            <v-autocomplete
              v-model.number="customerId"
              :items="customerOptions"
              :loading="customerOptionsLoading"
              :disabled="!shopId"
              item-title="display_name"
              item-value="id"
              :rules="[(v: number) => !!v || 'ກະລຸນາເລືອກລູກຄ້າ']"
              density="compact"
              variant="outlined"
              hide-details="auto"
              @update:search="onCustomerSearch"
            ></v-autocomplete>
          </v-col>

          <v-col cols="12" md="4">
            <label class="d-block mb-2">ສ່ວນຫຼຸດ (ຖ້າມີ) / Discount</label>
            <v-autocomplete
              v-model.number="discountId"
              :items="discountStore.discount_options"
              :loading="discountStore.discount_options_loading"
              :disabled="!shopId"
              item-title="code"
              item-value="id"
              clearable
              density="compact"
              variant="outlined"
              hide-details="auto"
            ></v-autocomplete>
          </v-col>
        </v-row>

        <v-divider class="my-6"></v-divider>

        <div class="d-flex justify-space-between align-center mb-4">
          <div class="text-subtitle-1">ລາຍການສິນຄ້າ</div>
          <v-btn color="primary" variant="tonal" size="small" @click="addLine" :disabled="!shopId">
            <v-icon class="mr-2">mdi-plus</v-icon>
            ເພີ່ມແຖວ
          </v-btn>
        </div>

        <v-row v-for="(line, index) in items" :key="index" class="align-center">
          <v-col cols="12" md="6">
            <v-autocomplete
              v-model="line.product_variant_id"
              :items="variantStore.variant_options"
              :loading="variantStore.variant_options_loading"
              item-title="variant_name"
              item-value="id"
              label="ຄົ້ນຫາສິນຄ້າ (ຊື່/SKU)"
              :rules="[(v: number) => !!v || 'ກະລຸນາເລືອກສິນຄ້າ']"
              density="compact"
              variant="outlined"
              hide-details="auto"
              @update:search="onVariantSearch"
              @update:model-value="(v: number) => onVariantSelect(index, v)"
            >
              <template v-slot:item="{ props: itemProps, item: opt }">
                <v-list-item v-bind="itemProps" :title="`${opt.raw.product_name} — ${opt.raw.variant_name}`" :subtitle="`SKU: ${opt.raw.sku_code} | ${formatNumber(opt.raw.price)} ກີບ`"></v-list-item>
              </template>
            </v-autocomplete>
          </v-col>

          <v-col cols="6" md="2">
            <v-text-field
              v-model.number="line.buy_quantity"
              type="number"
              label="ຈຳນວນ"
              :rules="[(v: number) => v > 0 || '>0']"
              density="compact"
              variant="outlined"
              hide-details="auto"
            ></v-text-field>
          </v-col>

          <v-col cols="6" md="2">
            <div class="text-body-2 text-grey">ລາຄາ/ໜ່ວຍ</div>
            <div class="text-body-1">{{ formatNumber(line.price) }}</div>
          </v-col>

          <v-col cols="6" md="1">
            <div class="text-body-2 text-grey">ລວມ</div>
            <div class="text-body-1">{{ formatNumber(line.price * (line.buy_quantity || 0)) }}</div>
          </v-col>

          <v-col cols="6" md="1">
            <v-btn
              color="error"
              icon="mdi-delete"
              variant="text"
              size="small"
              :disabled="items.length <= 1"
              @click="removeLine(index)"
            ></v-btn>
          </v-col>
        </v-row>

        <v-divider class="my-6"></v-divider>

        <v-row>
          <v-col cols="12" md="4">
            <label class="d-block mb-2">ຄ່າສົ່ງ / Shipping fee</label>
            <v-text-field
              v-model.number="shippingFee"
              type="number"
              density="compact"
              variant="outlined"
              hide-details="auto"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="8">
            <label class="d-block mb-2">ໝາຍເຫດ / Note</label>
            <v-text-field
              v-model="note"
              density="compact"
              variant="outlined"
              hide-details="auto"
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-card variant="tonal" color="primary" class="pa-4">
              <div class="d-flex justify-space-between"><span>ຍອດສິນຄ້າ</span><span>{{ formatNumber(itemsTotal) }}</span></div>
              <div class="d-flex justify-space-between"><span>ສ່ວນຫຼຸດ (ຄາດຄະເນ)</span><span>-{{ formatNumber(estimatedDiscountAmount) }}</span></div>
              <div class="d-flex justify-space-between"><span>ຄ່າສົ່ງ</span><span>{{ formatNumber(shippingFee || 0) }}</span></div>
              <v-divider class="my-2"></v-divider>
              <div class="d-flex justify-space-between text-h6"><span>ຍອດສຸດທິ (ຄາດຄະເນ)</span><span>{{ formatNumber(estimatedNetPayable) }}</span></div>
            </v-card>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
  </section>
</template>
