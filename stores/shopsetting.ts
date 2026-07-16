import axios from "@/helpers/axios";
import { ShopSettingModel } from "../models";
import { CallSwal } from "~/composables/global";

export const UseShopSettingStore = defineStore("shopsetting", {
  state() {
    return {
      loading: false,
      response_detail_query_data: null as ShopSettingModel.ShopSetting | null,
      exists: false,
    };
  },
  actions: {
    async GetDetailData(shop_id: string | number) {
      this.loading = true;
      try {
        const res = await axios.get<ShopSettingModel.ShopSettingResponse>(
          `/api/v1/shop-setting/setting/${shop_id}/`
        );
        if (res.status === 200) {
          this.response_detail_query_data = res.data.items;
          this.exists = true;
        }
      } catch (error: any) {
        this.exists = false;
        this.response_detail_query_data = null;
        if (error.response?.status !== 404) {
          console.error("Error fetching shop setting:", error);
        }
      } finally {
        this.loading = false;
      }
    },

    async CreateData(payload: ShopSettingModel.ShopSettingRequestBody) {
      this.loading = true;
      try {
        const res = await axios.post("/api/v1/shop-setting/create", payload);
        if (res.status === 200) {
          await CallSwal({
            icon: "success",
            title: "ສຳເລັດ",
            text: "ບັນທຶກຄ່າຕັ້ງຮ້ານຄ້າສຳເລັດແລ້ວ",
            timer: 1500,
            showConfirmButton: false,
          });
          return true;
        }
        return false;
      } catch (error: any) {
        await CallSwal({
          icon: "error",
          title: "ຜິດພາດ",
          text: error.response?.data?.message ?? "ບໍ່ສາມາດບັນທຶກຄ່າຕັ້ງໄດ້",
        });
        return false;
      } finally {
        this.loading = false;
      }
    },

    async UpdateData(shop_id: string | number, payload: ShopSettingModel.ShopSettingPatchRequest) {
      this.loading = true;
      try {
        const res = await axios.patch(`/api/v1/shop-setting/setting/${shop_id}/`, payload);
        if (res.status === 200) {
          await CallSwal({
            icon: "success",
            title: "ສຳເລັດ",
            text: "ອັບເດດຄ່າຕັ້ງສຳເລັດແລ້ວ",
            timer: 1500,
            showConfirmButton: false,
          });
          return true;
        }
        return false;
      } catch (error: any) {
        await CallSwal({
          icon: "error",
          title: "ຜິດພາດ",
          text: error.response?.data?.message ?? "ບໍ່ສາມາດອັບເດດຄ່າຕັ້ງໄດ້",
        });
        return false;
      } finally {
        this.loading = false;
      }
    },
  },
});
