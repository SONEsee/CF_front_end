import axios from "@/helpers/axios";
import { ShopModel } from "../models";
import { CallSwal, goPath } from "~/composables/global";

export const UseShopStore = defineStore("shop", {
  state() {
    return {
      loading: false,
      response_query_data: null as ShopModel.ShopListResponse["items"] | null,
      response_detail_query_data: null as ShopModel.Shop | null,
      request_query_data: {
        q: null as string | null,
        limit: 20,
        page: 1,
        loading: false,
      },
      shop_options: [] as ShopModel.ShopOption[],
      shop_options_loading: false,
      shop_options_loaded: false,
    };
  },
  actions: {
    async GetShopOptions(search?: string, force = false) {
      if (this.shop_options_loaded && !force && !search) return;
      this.shop_options_loading = true;
      try {
        const res = await axios.get<ShopModel.ShopOptionsResponse>("/api/v1/shop/shop-options", {
          params: { search: search ?? "", q: search ?? "" }
        });
        if (res.status === 200) {
          this.shop_options = res.data.items ?? [];
          this.shop_options_loaded = true;
        }
      } catch (error) {
        console.error("Error fetching shop options:", error);
      } finally {
        this.shop_options_loading = false;
      }
    },

    async GetListData() {
      this.loading = true;
      this.request_query_data.loading = true;
      try {
        const res = await axios.get<ShopModel.ShopListResponse>("/api/v1/shop/shop", {
          params: {
            page: this.request_query_data.page,
            limit: this.request_query_data.limit,
            search: this.request_query_data.q, // ສົ່ງ parameter search
            q: this.request_query_data.q,      // ສົ່ງ parameter q
          },
        });
        if (res.status === 200) {
          this.response_query_data = res.data.items;
        }
      } catch (error) {
        console.error("Error fetching shop data:", error);
      } finally {
        this.request_query_data.loading = false;
        this.loading = false;
      }
    },

    async GetDetailData(id: string | number) {
      this.loading = true;
      try {
        const res = await axios.get<ShopModel.ShopDetailResponse>("/api/v1/shop/shop", {
          params: { id },
        });
        if (res.status === 200) {
          this.response_detail_query_data = res.data.items[0] ?? null;
        }
      } catch (error) {
        console.error("Error fetching shop detail:", error);
      } finally {
        this.loading = false;
      }
    },

    async CreateData(payload: ShopModel.ShopRequestBody) {
      this.loading = true;
      try {
        const res = await axios.post("/api/v1/shop/create", payload);
        if (res.status === 200) {
          await CallSwal({
            icon: "success",
            title: "ສຳເລັດ",
            text: "ເພີ່ມຮ້ານຄ້າສຳເລັດແລ້ວ",
            timer: 1500,
            showConfirmButton: false,
          });
          goPath("/shop");
          return true;
        }
        return false;
      } catch (error: any) {
        await CallSwal({
          icon: "error",
          title: "ຜິດພາດ",
          text: error.response?.data?.message ?? "ບໍ່ສາມາດເພີ່ມຮ້ານຄ້າໄດ້",
        });
        return false;
      } finally {
        this.loading = false;
      }
    },

    async UpdateData(id: string | number, payload: ShopModel.ShopPatchRequest) {
      this.loading = true;
      try {
        const res = await axios.patch(`/api/v1/shop/shop/${id}/`, payload);
        if (res.status === 200) {
          await CallSwal({
            icon: "success",
            title: "ສຳເລັດ",
            text: "ອັບເດດຂໍ້ມູນສຳເລັດແລ້ວ",
            timer: 1500,
            showConfirmButton: false,
          });
          goPath("/shop");
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

    async UpdateStatus(id: string | number, status: ShopModel.ShopStatusRequest["status"]) {
      this.loading = true;
      try {
        const res = await axios.patch(`/api/v1/shop/shop/${id}/status`, { status });
        if (res.status === 200) {
          await CallSwal({
            icon: "success",
            title: "ສຳເລັດ",
            text: "ປ່ຽນສະຖານະຮ້ານຄ້າສຳເລັດແລ້ວ",
            timer: 1500,
            showConfirmButton: false,
          });
          await this.GetListData();
          return true;
        }
        return false;
      } catch (error: any) {
        console.error("Error updating shop status:", error);
        await CallSwal({
          icon: "error",
          title: "ຜິດພາດ",
          text: error.response?.data?.message ?? "ບໍ່ສາມາດປ່ຽນສະຖານະໄດ້",
        });
        return false;
      } finally {
        this.loading = false;
      }
    },
  },
});