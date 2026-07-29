<script lang="ts" setup>
import { useRoute } from "vue-router";
import { UserStore } from "@/stores/user";

const route = useRoute();
const userStore = UserStore();
const permission = UsePagePermission();
const title = ref("ລາຍລະອຽດຜູ້ໃຊ້ງານ");
const { roleName: resolveRoleName } = UseRoleNameResolver();
const { shopName: resolveShopName } = UseShopNameResolver();

const userId = computed(() => route.query.id as string);
const API_BASE_URL = import.meta.env.VITE_BASE_URL ?? "";

function getAvatarUrl(profileImage: string | null | undefined) {
  if (!profileImage) return null;
  if (profileImage.startsWith("http")) return profileImage;
  return `${API_BASE_URL}${profileImage}`;
}

const detail = computed(() => userStore.response_detail_query_data as any);
const localIsActive = ref(false); // ຄ່າ v-switch (sync ຈາກ detail ຫຼັງໂຫລດ, ອັບເດດເອງຕອນ toggle ສຳເລັດ)
const toggling = ref(false);

// ---- Role & Shop name lookup (ໃຊ້ options-based resolver, ບໍ່ດຶງ paginated list) ----
const roleName = computed(() => resolveRoleName(detail.value?.role_id));
const shopName = computed(() => resolveShopName(detail.value?.shop_id));

const loadUserDetail = async () => {
  if (!userId.value) return;
  await userStore.GetDetailData(userId.value);
  if (detail.value) {
    localIsActive.value = !!detail.value.is_active;
  }
};

onMounted(async () => {
  await loadUserDetail();
});

const onToggleStatus = async (value: boolean | null) => {
  value = !!value;
  if (!permission.value.can_update) {   
    localIsActive.value = !value;
    return;
  }

  const notification = await CallSwal({
    icon: "warning",
    title: "ຢືນຢັນການປ່ຽນສະຖານະ",
    text: value
      ? "ທ່ານຕ້ອງການເປີດໃຊ້ງານຜູ້ໃຊ້ນີ້ບໍ່?"
      : "ທ່ານຕ້ອງການປິດການໃຊ້ງານຜູ້ໃຊ້ນີ້ບໍ່?",
    showCancelButton: true,
    confirmButtonText: "ຕົກລົງ",
    cancelButtonText: "ຍົກເລີກ",
  });

  if (!notification.isConfirmed) {
    localIsActive.value = !value;
    return;
  }

  toggling.value = true;
  const success = await userStore.ToggleStatus(userId.value, value);
  toggling.value = false;

  if (success) {
    if (detail.value) detail.value.is_active = value;
  } else {
    localIsActive.value = !value;
  }
};

const goPath = (path: string) => {
  navigateTo(path);
};
</script>

<template>
  <section class="pa-6">
    <v-card elevation="0" class="pa-6">
      <GlobalTextTitleLine :title="title" class="mb-8">
        <template #actions>
          <v-btn variant="outlined" @click="goPath('/user')">ກັບຄືນ</v-btn>
        </template>
      </GlobalTextTitleLine>

      <GlobalPermissionDenied v-if="!permission.can_view" />

      <template v-else-if="detail">
        <v-row>
          <v-col cols="12" class="d-flex align-center mb-4">
            <v-avatar size="96" color="grey-lighten-2">
              <v-img
                v-if="getAvatarUrl(detail.profile_image)"
                :src="getAvatarUrl(detail.profile_image)!"
                cover
              />
              <v-icon v-else size="40" color="grey-darken-1">mdi-account</v-icon>
            </v-avatar>

            <div class="ml-6">
              <div class="text-h6">{{ detail.full_name }}</div>
              <div class="text-body-2 text-grey">@{{ detail.username }}</div>
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <label class="d-block mb-2 text-grey">ຊື່ ແລະ ນາມສະກຸນ</label>
            <div class="text-body-1 mb-4">{{ detail.full_name || "-" }}</div>

            <label class="d-block mb-2 text-grey">ຊື່ຜູ້ໃຊ້ງານ</label>
            <div class="text-body-1 mb-4">{{ detail.username || "-" }}</div>

            <label class="d-block mb-2 text-grey">ອີເມວ</label>
            <div class="text-body-1 mb-4">{{ detail.email || "-" }}</div>

            <label class="d-block mb-2 text-grey">ເບີໂທລະສັບ</label>
            <div class="text-body-1 mb-4">{{ detail.phone || "-" }}</div>
          </v-col>

          <v-col cols="12" md="6">
            <label class="d-block mb-2 text-grey">ບົດບາດ / Role</label>
            <div class="text-body-1 mb-4">{{ roleName ?? "-" }}</div>

            <label class="d-block mb-2 text-grey">ຮ້ານຄ້າ / Shop</label>
            <div class="text-body-1 mb-4">{{ shopName ?? "-" }}</div>

            <label class="d-block mb-2 text-grey">ສະຖານະ ການໃຊ້ງານ</label>
            <div class="d-flex align-center ga-3 mb-4">
              <v-switch
                v-model="localIsActive"
                color="success"
                hide-details
                :disabled="!permission.can_update || toggling"
                :loading="toggling"
                @update:model-value="onToggleStatus"
              ></v-switch>
              <v-chip :color="localIsActive ? 'info' : 'error'">
                {{ localIsActive ? "ເປີດໃຊ້ງານ" : "ປິດໃຊ້ງານ" }}
              </v-chip>
            </div>
          </v-col>
        </v-row>
      </template>

      <v-row v-else>
        <v-col cols="12" class="text-center py-8 text-grey">
          <v-progress-circular v-if="userStore.loading" indeterminate color="primary" />
          <span v-else>ບໍ່ພົບຂໍ້ມູນຜູ້ໃຊ້ງານ</span>
        </v-col>
      </v-row>
    </v-card>
  </section>
</template>