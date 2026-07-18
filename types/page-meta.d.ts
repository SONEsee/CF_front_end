export {};

declare module "vue-router" {
  interface RouteMeta {
    // ID ຂອງ sub_menus row ທີ່ page ນີ້ຜູກຢູ່ (ໃຊ້ຜູກປຸ່ມ create/update/delete ໃສ່ permissions ຂອງ role)
    submenuId?: number;
  }
}
