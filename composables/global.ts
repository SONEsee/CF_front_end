import numeral from "numeral";
import swal from "sweetalert2";
import { AxiosError } from "axios";
import type { SweetAlertOptions } from "sweetalert2";
import { DefaultResponseModel } from "@/models/";
import { UsePermissionGuardStore } from "@/stores/permissionGuard";
import { UseShopStore } from "@/stores/shop";
import { UseRoleStore } from "@/stores/role";

// ໃຊ້ຜູກປຸ່ມ create/edit/delete ຂອງໜ້າ CRUD ໃສ່ສິດອະນຸຍາດ (permissions) ຂອງ role ປັດຈຸບັນ
// submenuId ຖືກອ່ານຈາກ route.meta.submenuId ທີ່ກຳນົດຜ່ານ definePageMeta() ຂອງແຕ່ລະ page
// (ບໍ່ຕ້ອງພິມ path ຊ້ຳໃນແຕ່ລະ component ອີກ)
export const UsePagePermission = () => {
  const guard = UsePermissionGuardStore();
  const route = useRoute();
  if (!guard.loaded && !guard.loading) {
    guard.Load();
  }
  return computed(() => guard.can(route.meta.submenuId));
};

// ໃຊ້ແປ shop_id -> shop_name ໃນຕາຕະລາງ/ຟອມໃດໆ (ດຶງ shop_options ຄັ້ງດຽວ, ໃຊ້ຊ້ຳໄດ້ທຸກບ່ອນ)
// ອັດຕະໂນມັດໂຫລດຄັ້ງທຳອິດທີ່ຖືກເອີ້ນໃຊ້, ຄືກັນກັບ UsePagePermission
export const UseShopNameResolver = () => {
  const shopStore = UseShopStore();
  if (!shopStore.shop_options_loaded && !shopStore.shop_options_loading) {
    shopStore.GetShopOptions();
  }

  const shopNameById = computed(() => {
    const map = new Map<number, string>();
    for (const shop of shopStore.shop_options) {
      map.set(shop.id, shop.shop_name);
    }
    return map;
  });

  const shopName = (shopId: number | null | undefined) => {
    if (!shopId) return "-";
    return shopNameById.value.get(shopId) ?? `#${shopId}`;
  };

  return {
    shopName,
    shopOptions: computed(() => shopStore.shop_options),
    loading: computed(() => shopStore.shop_options_loading),
  };
};

// ໃຊ້ແປ role_id -> role_name ໃນຕາຕະລາງ/ຟອມໃດໆ (ດຶງ role_options ຄັ້ງດຽວ, ໃຊ້ຊ້ຳໄດ້ທຸກບ່ອນ)
// ຄືກັນກັບ UseShopNameResolver
export const UseRoleNameResolver = () => {
  const roleStore = UseRoleStore();
  if (!roleStore.role_options_loaded && !roleStore.role_options_loading) {
    roleStore.GetRoleOptions();
  }

  const roleNameById = computed(() => {
    const map = new Map<number, string>();
    for (const role of roleStore.role_options) {
      map.set(role.id, role.role_name);
    }
    return map;
  });

  const roleName = (roleId: number | null | undefined) => {
    if (!roleId) return "-";
    return roleNameById.value.get(roleId) ?? `#${roleId}`;
  };

  return {
    roleName,
    roleOptions: computed(() => roleStore.role_options),
    loading: computed(() => roleStore.role_options_loading),
  };
};

// ດຶງ id ຂອງຜູ້ໃຊ້ທີ່ login ຢູ່ໃນປັດຈຸບັນ (ຈາກ localStorage) ໃຊ້ຝັງ user_id ຫຼັງບ້ານ
// ໂດຍບໍ່ໃຫ້ຜູ້ໃຊ້ເຫັນ ຫຼື ປ້ອນເອງ
export const GetCurrentUserId = (): number | null => {
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    return JSON.parse(raw)?.id ?? null;
  } catch {
    return null;
  }
};

export const UseGetFormatDatePicker = (date: any) => {
  if (date) {
    const datenow = new Date(date);
    const day = datenow.getDate();
    const month = datenow.getMonth() + 1;
    const year = datenow.getFullYear();
    return `${numeral(day).format("00")}/${numeral(month).format(
      "00"
    )}/${year}`;
  } else {
    return date;
  }
};

export const goPath = (path: string | null) => {
  if (path !== null) {
    window.location.href = path;
  }
};

export const DefaultSwalError = (err: any) => {
  const errors = err as AxiosError;
  const response_data = errors?.response
    ?.data as DefaultResponseModel.DefaultErrorResponse;
  return swal.fire({
    icon: "error",
    title: "ຜິດພາດ",
    text: response_data?.error ?? "",
  });
};

export const FormatDatetime = (date: any) => {
  const dayjs = useDayjs();
  if (date) {
    return dayjs(new Date(date)).format("DD-MM-YYYY HH:mm:ss");
  }

  return date;
};

export const onLogout = () => {
  localStorage.clear();
  setTimeout(() => {
    goPath("/login");
  }, 1200);
};

export const GetAgencyType = () => {
  return [
    {
      title: "ຕົວແທນແບບແຂວງ (Province Agency)",
      value: "PROVINCE",
    },
    {
      title: "ຕົວແທນແບບເມືອງ (District Agency)",
      value: "DISTRICT",
    },
    {
      title: "ຕົວແທນແບບບຸກຄົນ (Unit Agency)",
      value: "UNIT",
    },
  ];
};

export const GetAgencyTypeLabel = (type: string): string => {
  const list_of_agency_label = {
    PROVINCE: "ຕົວແທນແບບແຂວງ (Province Agency)",
    DISTRICT: "ຕົວແທນແບບເມືອງ (District Agency)",
    UNIT: "ຕົວແທນແບບບຸກຄົນ (Unit Agency)",
  } as { [key: string]: string };

  return list_of_agency_label?.[type] ?? "N/A";
};

export const GetDefaultStatus = () => {
  return [
    { title: "ເປີດໃຊ້ງານ", value: 1 },
    {
      title: "ປິດໃຊ້ງານ",
      value: 0,
    },
  ];
};

export const CallSwal = (options: SweetAlertOptions) => {
  return swal.fire({
    ...options,
    customClass: {
      confirmButton: "custom-confirm-button",
    },
  });
};

export const GetImageUrl = (file: File | string | null) => {
  if (file) {
    if (typeof file === "object") {
      return URL.createObjectURL(file);
    } else {
      return file;
    }
  }

  return "";
};

export const GetIdentitiesList = () => {
  return [
    {
      title: "ບັດປະຈຳຕົວ",
      value: 1,
    },
    {
      title: "ພາສປອດ / Passport",
      value: 2,
    },
    {
      title: "ສຳມະໂນຄົວ",
      value: 3,
    },
  ];
};
export const GetIdentitiesLabel = (type: number): string => {
  const list_indetities_label = {
    1: "ບັດປະຈຳຕົວ",
    2: "ພາສປອດ / Passport",
    3: "ສຳມະໂນຄົວ",
  } as { [key: number]: string };
  return list_indetities_label?.[type] ?? "N/A";
};

export const formatnumber = (value: number | string) => {
  if (value) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } else {
    return 0;
  }
};

export const GetItemPerPageOptions = () => {
  return [
    {
      title: "2",
      value: 2,
    },
    {
      title: "5",
      value: 5,
    },
    {
      title: "10",
      value: 10,
    },
    {
      title: "20",
      value: 20,
    },
    {
      title: "30",
      value: 30,
    },
    {
      title: "50",
      value: 50,
    },
    {
      title: "100",
      value: 100,
    },
    {
      title: "200",
      value: 200,
    },
  ];
};

export const delayGoPath = (path: string) => {
  if (!path) {
    return;
  }

  return setTimeout(() => {
    window.location.href = path;
  }, 1200);
};
