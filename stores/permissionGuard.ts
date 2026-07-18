import axios from "@/helpers/axios";

interface PermissionRow {
  id: number;
  role_id: number;
  submenu_id: number;
  can_view: boolean;
  can_create: boolean;
  can_update: boolean;
  can_delete: boolean;
}

export interface PermissionFlags {
  can_view: boolean;
  can_create: boolean;
  can_update: boolean;
  can_delete: boolean;
}

const DENY_ALL: PermissionFlags = {
  can_view: false,
  can_create: false,
  can_update: false,
  can_delete: false,
};

export const UsePermissionGuardStore = defineStore("permissionGuard", {
  state() {
    return {
      loading: false,
      loaded: false,
      permissions: [] as PermissionRow[],
    };
  },
  getters: {
    roleId(): number | null {
      const raw = localStorage.getItem("user");
      if (!raw) return null;
      try {
        return JSON.parse(raw)?.role_id ?? null;
      } catch {
        return null;
      }
    },
  },
  actions: {
    async Load(force = false) {
      if (this.loaded && !force) return;
      this.loading = true;
      try {
        const res = await axios.get<{ items: PermissionRow[] }>(
          "/api/v1/permission/permission"
        );
        this.permissions = res.data.items ?? [];
        this.loaded = true;
      } catch (error) {
        console.error("Error loading permission guard data:", error);
        this.permissions = [];
      } finally {
        this.loading = false;
      }
    },

    // ດຶງສິດອະນຸຍາດຂອງ role ປັດຈຸບັນ ສຳລັບ submenu_id ໜຶ່ງ (ຈາກ route meta ຂອງໜ້ານັ້ນ)
    // ຖ້າຍັງບໍ່ໄດ້ Load() / ບໍ່ມີ submenuId / ບໍ່ພົບຂໍ້ມູນ -> deny ໝົດ (fail-safe)
    can(submenuId: number | undefined): PermissionFlags {
      if (!this.loaded || this.roleId === null || submenuId === undefined) {
        return DENY_ALL;
      }

      const permission = this.permissions.find(
        (p) => p.role_id === this.roleId && p.submenu_id === submenuId
      );
      if (!permission) return DENY_ALL;

      return {
        can_view: permission.can_view,
        can_create: permission.can_create,
        can_update: permission.can_update,
        can_delete: permission.can_delete,
      };
    },
  },
});
