import axios from "@/helpers/axios";
import { defineStore } from "pinia";
import { SubMenuModel } from "../models";
import { CallSwal, goPath } from "~/composables/global";

export const UseSubMenuStore = defineStore("submenu", {
  state() {
    return {
      loading: false,
      response_query_data: null as SubMenuModel.SubMenuListResponse["items"] | null,
      response_detail_query_data: null as SubMenuModel.SubMenu | null,
      request_query_data: {
        q: null as string | null,
        limit: 20,
        page: 1,
        loading: false,
      },
    };
  },
  actions: {
    async GetListData() {
      this.loading = true;
      this.request_query_data.loading = true;
      try {
        // 🟢 ສົ່ງ param `q` ( search query ) ໄປໃຫ້ Backend
        const res = await axios.get<SubMenuModel.SubMenuListResponse>(
          "/api/v1/sub/sub-menu",
          {
            params: {
              page: this.request_query_data.page,
              limit: this.request_query_data.limit,
              q: this.request_query_data.q || undefined, // ຖ້າເປັນ string ຫວ່າງ ໃຫ້ສົ່ງ undefined
            },
          }
        );

        if (res.status === 200) {
          // 🟢 Backend ໄດ້ JOIN ດຶງ main_menu_name ມາໃຫ້ແລ້ວ ສາມາດນຳໃຊ້ໄດ້ເລີຍ
          this.response_query_data = res.data.items;
        }
      } catch (error) {
        console.error("Error fetching sub menu data:", error);
      } finally {
        this.request_query_data.loading = false;
        this.loading = false;
      }
    },

    async GetDetailData(id: string | number) {
      this.loading = true;
      try {
        const res = await axios.get<SubMenuModel.SubMenuDetailResponse>(
          "/api/v1/sub/sub-menu",
          { params: { id } }
        );
        if (res.status === 200) {
          this.response_detail_query_data = res.data.items[0] ?? null;
        }
      } catch (error) {
        console.error("Error fetching sub menu detail:", error);
      } finally {
        this.loading = false;
      }
    },

    async CreateData(payload: SubMenuModel.SubMenuRequestBody) {
      this.loading = true;
      try {
        const res = await axios.post("/api/v1/sub/create", payload);
        if (res.status === 200) {
          await CallSwal({
            icon: "success",
            title: "ສຳເລັດ",
            text: "ເພີ່ມເມນູຍ່ອຍສຳເລັດແລ້ວ",
            timer: 1500,
            showConfirmButton: false,
          });
          goPath("/sub-menu");
          return true;
        }
        return false;
      } catch (error: any) {
        await CallSwal({
          icon: "error",
          title: "ຜິດພາດ",
          text: error.response?.data?.message ?? "ບໍ່ສາມາດເພີ່ມເມນູຍ່ອຍໄດ້",
        });
        return false;
      } finally {
        this.loading = false;
      }
    },

    async UpdateData(id: string | number, payload: SubMenuModel.SubMenuPatchRequest) {
      this.loading = true;
      try {
        const res = await axios.patch(`/api/v1/sub/sub-menu/${id}/`, payload);
        if (res.status === 200) {
          await CallSwal({
            icon: "success",
            title: "ສຳເລັດ",
            text: "ອັບເດດຂໍ້ມູນສຳເລັດແລ້ວ",
            timer: 1500,
            showConfirmButton: false,
          });
          goPath("/sub-menu");
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
          text: "ທ່ານກຳລັງລົບເມນູຍ່ອຍນີ້ ທ່ານແນ່ໃຈແລ້ວບໍ່?",
          showCancelButton: true,
          confirmButtonText: "ຕົກລົງ",
          cancelButtonText: "ຍົກເລີກ",
        });
        if (!notification.isConfirmed) return;

        this.loading = true;
        const res = await axios.delete(`/api/v1/sub/sub-menu/${id}/`);
        if (res.status === 200) {
          await this.GetListData();
        }
      } catch (error) {
        console.error("Error deleting sub menu:", error);
      } finally {
        this.loading = false;
      }
    },
  },
});