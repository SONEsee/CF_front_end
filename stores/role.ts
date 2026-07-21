import axios from "@/helpers/axios";
import { RoleModel } from "../models";
import { CallSwal, goPath } from "~/composables/global";

export const UseRoleStore = defineStore("role", {
  state() {
    return {
      loading: false,
      response_query_data: null as RoleModel.RoleListResponse["items"] | null,
      response_detail_query_data: null as RoleModel.Role | null,
      request_query_data: {
        q: null as string | null,
        limit: 20,
        page: 1,
        loading: false,
      },
      role_options: [] as RoleModel.RoleOption[],
      role_options_loading: false,
      role_options_loaded: false,
    };
  },
  actions: {
    // ດຶງ role ທັງໝົດແບບບໍ່ມີ pagination — ໃຊ້ສຳລັບ dropdown/autocomplete (ເຊັ່ນ UserCreate)
    async GetRoleOptions(force = false) {
      if (this.role_options_loaded && !force) return;
      this.role_options_loading = true;
      try {
        const res = await axios.get<RoleModel.RoleOptionsResponse>("/api/v1/role/role-options");
        if (res.status === 200) {
          this.role_options = res.data.items ?? [];
          this.role_options_loaded = true;
        }
      } catch (error) {
        console.error("Error fetching role options:", error);
      } finally {
        this.role_options_loading = false;
      }
    },

    async GetListData() {
      this.loading = true;
      this.request_query_data.loading = true;
      try {
        const res = await axios.get<RoleModel.RoleListResponse>("/api/v1/role/role", {
          params: {
            page: this.request_query_data.page,
            limit: this.request_query_data.limit,
            q: this.request_query_data.q,
          },
        });
        if (res.status === 200) {
          this.response_query_data = res.data.items;
        }
      } catch (error) {
        console.error("Error fetching role data:", error);
      } finally {
        this.request_query_data.loading = false;
        this.loading = false;
      }
    },

    async GetDetailData(id: string | number) {
      this.loading = true;
      try {
        const res = await axios.get<RoleModel.RoleDetailResponse>("/api/v1/role/role", {
          params: { id },
        });
        if (res.status === 200) {
          this.response_detail_query_data = res.data.items[0] ?? null;
        }
      } catch (error) {
        console.error("Error fetching role detail:", error);
      } finally {
        this.loading = false;
      }
    },

    async CreateData(payload: RoleModel.RoleRequestBody) {
      this.loading = true;
      try {
        const res = await axios.post("/api/v1/role/create", payload);
        if (res.status === 200) {
          await CallSwal({
            icon: "success",
            title: "ສຳເລັດ",
            text: "ເພີ່ມສິດການນຳໃຊ້ສຳເລັດແລ້ວ",
            timer: 1500,
            showConfirmButton: false,
          });
          goPath("/role");
          return true;
        }
        return false;
      } catch (error: any) {
        await CallSwal({
          icon: "error",
          title: "ຜິດພາດ",
          text: error.response?.data?.message ?? "ບໍ່ສາມາດເພີ່ມສິດການນຳໃຊ້ໄດ້",
        });
        return false;
      } finally {
        this.loading = false;
      }
    },

    async UpdateData(id: string | number, payload: RoleModel.RolePatchRequest) {
      this.loading = true;
      try {
        const res = await axios.patch(`/api/v1/role/role/${id}/`, payload);
        if (res.status === 200) {
          await CallSwal({
            icon: "success",
            title: "ສຳເລັດ",
            text: "ອັບເດດຂໍ້ມູນສຳເລັດແລ້ວ",
            timer: 1500,
            showConfirmButton: false,
          });
          goPath("/role");
          return true;
        }
        return false;
      } catch (error: any) {
        await CallSwal({
          icon: "error",
          title: "ຜິດພາດ",
          text: error.response?.data?.message ?? "ບໍ່ສາມາດອັບເດດຂໍ້ມູນໄດ້",
        });
        return false;
      } finally {
        this.loading = false;
      }
    },

    async DeleteData(id: string | number) {
      try {
        const notification = await CallSwal({
          icon: "warning",
          title: "ຄຳເຕືອນ",
          text: "ທ່ານກຳລັງລົບສິດການນຳໃຊ້ນີ້ ທ່ານແນ່ໃຈແລ້ວບໍ່?",
          showCancelButton: true,
          confirmButtonText: "ຕົກລົງ",
          cancelButtonText: "ຍົກເລີກ",
        });
        if (!notification.isConfirmed) return;

        this.loading = true;
        const res = await axios.delete(`/api/v1/role/role/${id}/`);
        if (res.status === 200) {
          await this.GetListData();
        }
      } catch (error) {
        console.error("Error deleting role:", error);
      } finally {
        this.loading = false;
      }
    },
  },
});
