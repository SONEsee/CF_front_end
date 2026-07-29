import axios from "@/helpers/axios";
import { ShopSubscriptionModel } from "../models";
import { CallSwal, goPath } from "~/composables/global";

export const UseShopSubscriptionStore = defineStore("shopSubscription", {
  state() {
    return {
      loading: false,
      response_query_data: null as ShopSubscriptionModel.ShopSubscriptionListResponse["items"] | null,
      response_detail_query_data: null as ShopSubscriptionModel.ShopSubscription | null,
      request_query_data: {
        shop_id: null as number | null,
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
        const res = await axios.get<ShopSubscriptionModel.ShopSubscriptionListResponse>(
          "/api/v1/shop-subscription/subscription",
          {
            params: {
              page: this.request_query_data.page,
              limit: this.request_query_data.limit,
              shop_id: this.request_query_data.shop_id,
            },
          }
        );
        if (res.status === 200) {
          this.response_query_data = res.data.items;
        }
      } catch (error) {
        console.error("Error fetching shop subscription data:", error);
      } finally {
        this.request_query_data.loading = false;
        this.loading = false;
      }
    },

    async GetDetailData(id: string | number) {
      this.loading = true;
      try {
        const res = await axios.get<ShopSubscriptionModel.ShopSubscriptionDetailResponse>(
          "/api/v1/shop-subscription/subscription",
          { params: { id } }
        );
        if (res.status === 200) {
          this.response_detail_query_data = res.data.items[0] ?? null;
        }
      } catch (error) {
        console.error("Error fetching shop subscription detail:", error);
      } finally {
        this.loading = false;
      }
    },

    async CreateData(payload: ShopSubscriptionModel.ShopSubscriptionRequestBody) {
      this.loading = true;
      try {
        const res = await axios.post("/api/v1/shop-subscription/create", payload);
        if (res.status === 200) {
          await CallSwal({
            icon: "success",
            title: "ສຳເລັດ",
            text: "ເພີ່ມການສະໝັກໃຊ້ງານສຳເລັດແລ້ວ",
            timer: 1500,
            showConfirmButton: false,
          });
          goPath("/shop-subscription");
          return true;
        }
        return false;
      } catch (error: any) {
        await CallSwal({
          icon: "error",
          title: "ຜິດພາດ",
          text: error.response?.data?.message ?? "ບໍ່ສາມາດເພີ່ມການສະໝັກໃຊ້ງານໄດ້",
        });
        return false;
      } finally {
        this.loading = false;
      }
    },

    async UpdateData(id: string | number, payload: ShopSubscriptionModel.ShopSubscriptionPatchRequest) {
      this.loading = true;
      try {
        const res = await axios.patch(`/api/v1/shop-subscription/subscription/${id}/`, payload);
        if (res.status === 200) {
          await CallSwal({
            icon: "success",
            title: "ສຳເລັດ",
            text: "ອັບເດດຂໍ້ມູນສຳເລັດແລ້ວ",
            timer: 1500,
            showConfirmButton: false,
          });
          goPath("/shop-subscription");
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

    async UpdateStatus(id: string | number, status: ShopSubscriptionModel.ShopSubscriptionStatusRequest["status"]) {
      this.loading = true;
      try {
        const res = await axios.patch(`/api/v1/shop-subscription/subscription/${id}/status`, { status });
        if (res.status === 200) {
          await CallSwal({
            icon: "success",
            title: "ສຳເລັດ",
            text: "ປ່ຽນສະຖານະສຳເລັດແລ້ວ",
            timer: 1500,
            showConfirmButton: false,
          });
          await this.GetListData();
          return true;
        }
        return false;
      } catch (error: any) {
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
