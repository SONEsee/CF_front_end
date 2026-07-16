<template>
  <v-app-bar :elevation="2" color="primary">
    <template v-slot:prepend>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
    </template>

    <v-app-bar-title>CF_onLy</v-app-bar-title>
    <v-menu min-width="200px" rounded>
      <template v-slot:activator="{ props }">
        <v-btn icon v-bind="props">
          <v-avatar class="" color="#BDBDBD" size="large">
            <span class="text-h5" v-if="user.profileImage">
                <img
                class="mt-2"
                  :src="`http://localhost:8000${user.profileImage}`"
                  alt="Profile Image"
                  width="100%"
                  height="100%"
                 
                />
              </span>
            <span class="text-h5" v-else>
              <v-icon
                icon="mdi-account-circle-outline"
                color="#FFFFFF"
              ></v-icon>
            </span>
          </v-avatar>
        </v-btn>
      </template>
      <v-card>
        <v-card-text>
          <div class="mx-auto text-center">
            <v-avatar color="brown">
              <span class="text-h5" v-if="user.profileImage">
                <img
                class="mt-2"
                  :src="`http://localhost:8000${user.profileImage}`"
                  alt="Profile Image"
                  width="100%"
                  height="100%"
                 
                />
              </span>
              <span class="text-h5" v-else>
                <v-icon icon="mdi-account-circle-outline"></v-icon>
              </span>
            </v-avatar>
            <h3>{{ user.username }}</h3>
            <p class="text-caption mt-1">
              {{ user.email }}
            </p>
            <v-divider class="my-3"></v-divider>
            <v-btn variant="text" rounded> ແກ້ໄຂຂໍ້ມູນສວນຕົວ </v-btn>
            <v-divider class="my-3"></v-divider>
            <v-btn variant="text" rounded @click="onLogout"> ອອກຈາກລະບົບ </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-menu>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" permanent :rail="rail" order="1">
    <v-progress-linear v-if="navLoading" indeterminate color="primary"></v-progress-linear>

    <v-list nav density="comfortable">
      <div v-for="(item, i) in items" :key="`item-${i}`" class="mb-2">
        <v-divider v-if="i > 0" class="mb-2"></v-divider>
        <v-list-subheader>{{ item.title }}</v-list-subheader>

        <v-list-item
          color="primary"
          v-for="(menu, indexMenu) in item.menu"
          :key="`menu-${indexMenu}`"
          :value="menu"
          rounded="xl"
          :to="menu.to"
        >
          <template v-slot:prepend>
            <v-icon :icon="menu.icon"></v-icon>
          </template>

          <v-list-item-title v-text="menu.text"></v-list-item-title>
        </v-list-item>
      </div>

      <v-alert
        v-if="!navLoading && navError"
        type="warning"
        variant="tonal"
        density="compact"
        class="mx-2 mt-2"
      >
        ດຶງເມນູຈາກ backend ບໍ່ສຳເລັດ, ສະແດງເມນູຄ່າເລີ່ມຕົ້ນ
      </v-alert>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { UseMainMenuStore } from "@/stores/mainmenu";
import { UseSubMenuStore } from "@/stores/submenu";

const User = localStorage.getItem("user");
const userData = User ? JSON.parse(User) : null;
const user = userData ? userData : null;

const mainMenuStore = UseMainMenuStore();
const subMenuStore = UseSubMenuStore();
const navLoading = ref(true);
const navError = ref(false);

// ໜ້າຫຼັກ ບໍ່ໄດ້ມາຈາກ backend (ບໍ່ແມ່ນ submenu ຈິງ), ຄົງໄວ້ສະເໝີ
const staticItems = [
  {
    title: "ໜ້າຫຼັກ",
    menu: [{ text: "Dashboard", icon: "mdi-view-dashboard", to: "/" }],
  },
];

// ໃຊ້ຄາຄົງທີ່ນີ້ເປັນ fallback ຖ້າ backend ຍັງບໍ່ໄດ້ seed ຂໍ້ມູນ main-menu/sub-menu ຫຼືດຶງຂໍ້ມູນລົ້ມເຫຼວ
const fallbackItems = [
  {
    title: "ຜູ້ໃຊ້ງານ",
    menu: [
      { text: "ຈັດການຂໍ້ມູນຜູ້ໃຊ້ງານ", icon: "mdi-account-cog", to: "/user" },
    ],
  },
  {
    title: "ຮ້ານຄ້າ",
    menu: [
      { text: "ຈັດການຮ້ານຄ້າ", icon: "mdi-store-cog", to: "/shop" },
      { text: "ຄ່າຕັ້ງຮ້ານຄ້າ", icon: "mdi-cog-outline", to: "/shop-setting" },
      { text: "ບັນຊີທະນາຄານຮ້ານຄ້າ", icon: "mdi-bank", to: "/shop-bank-account" },
    ],
  },
  {
    title: "ສິດທິ ແລະ ເມນູ",
    menu: [
      { text: "ຈັດການສິດການນຳໃຊ້", icon: "mdi-shield-account", to: "/role" },
      { text: "ຈັດການສິດອະນຸຍາດ", icon: "mdi-shield-key", to: "/permission" },
      { text: "ຈັດການເມນູຫຼັກ", icon: "mdi-menu", to: "/main-menu" },
      { text: "ຈັດການເມນູຍ່ອຍ", icon: "mdi-menu-open", to: "/sub-menu" },
    ],
  },
];

// ສ້າງໂຄງສ້າງເມນູຈາກ MainMenu (ຫົວຂໍ້ກຸ່ມ) + SubMenu (link ພາຍໃນກຸ່ມ) ຂອງ backend ຈິງ
const dynamicItems = computed(() => {
  const mainMenus = mainMenuStore.response_query_data?.list_data ?? [];
  const subMenus = subMenuStore.response_query_data?.list_data ?? [];

  return mainMenus
    .map((menu) => ({
      title: menu.menu_name,
      menu: subMenus
        .filter((sub) => sub.main_menu_id === menu.id)
        .map((sub) => ({
          text: sub.submenu_name,
          icon: menu.icon_class || "mdi-circle-small",
          to: sub.route_path || "/",
        })),
    }))
    .filter((group) => group.menu.length > 0);
});

const items = computed(() => {
  if (navLoading.value) return staticItems;
  if (dynamicItems.value.length > 0) return [...staticItems, ...dynamicItems.value];
  return [...staticItems, ...fallbackItems];
});

onMounted(async () => {
  navLoading.value = true;
  navError.value = false;
  try {
    mainMenuStore.request_query_data.limit = 100;
    subMenuStore.request_query_data.limit = 200;
    await Promise.all([mainMenuStore.GetListData(), subMenuStore.GetListData()]);
    // stores swallow their own axios errors internally, so a null response
    // after the request settles means the fetch failed (not just "empty")
    if (!mainMenuStore.response_query_data || !subMenuStore.response_query_data) {
      navError.value = true;
    }
  } catch (error) {
    console.error("Error loading nav menu from backend:", error);
    navError.value = true;
  } finally {
    navLoading.value = false;
  }
});

const drawer = ref(true);
const rail = ref(false);
</script>
