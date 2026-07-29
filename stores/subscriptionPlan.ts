import axios from "@/helpers/axios";
import { SubscriptionPlanModel } from "../models";
import { CallSwal, goPath } from "~/composables/global";

export const UseSubscriptionPlanStore = defineStore("subscriptionPlan", {
  state() {
    return {
      loading: false,
      response_query_data: null as SubscriptionPlanModel.SubscriptionPlanListResponse["items"] | null,
      response_detail_query_data: null as SubscriptionPlanModel.SubscriptionPlan | null,
      request_query_data: {
        limit: 20,
        page: 1,
        loading: false,
      },
      plan_options: [] as SubscriptionPlanModel.SubscriptionPlan[],
      plan_options_loading: false,
      plan_options_loaded: false,
    };
  },
  actions: {
    // ໃຊ້ສຳລັບ dropdown ເລືອກ plan (ຈຳນວນແພັກເກັດມີໜ້ອຍ, ດຶງທັງໝົດຄັ້ງດຽວ)
    // ໝາຍເຫດ: GET ບໍ່ມີ page/limit -> backend ຄືນ items ເປັນ array ກົງໆ (ResponseSuccessWithData),
    // ບໍ່ໄດ້ຫໍ່ໃນ {list_data, pagination} ຄື GetListData() ທີ່ສົ່ງ page/limit ໄປ
    async GetPlanOptions(force = false) {
      if (this.plan_options_loaded && !force) return;
      this.plan_options_loading = true;
      try {
        const res = await axios.get<SubscriptionPlanModel.SubscriptionPlanDetailResponse>(
          "/api/v1/subscription-plan/plan"
        );
        if (res.status === 200) {
          this.plan_options = res.data.items ?? [];
          this.plan_options_loaded = true;
        }
      } catch (error) {
        console.error("Error fetching subscription plan options:", error);
      } finally {
        this.plan_options_loading = false;
      }
    },

    async GetListData() {
      this.loading = true;
      this.request_query_data.loading = true;
      try {
        const res = await axios.get<SubscriptionPlanModel.SubscriptionPlanListResponse>(
          "/api/v1/subscription-plan/plan",
          {
            params: {
              page: this.request_query_data.page,
              limit: this.request_query_data.limit,
            },
          }
        );
        if (res.status === 200) {
          this.response_query_data = res.data.items;
        }
      } catch (error) {
        console.error("Error fetching subscription plan data:", error);
      } finally {
        this.request_query_data.loading = false;
        this.loading = false;
      }
    },

    async GetDetailData(id: string | number) {
      this.loading = true;
      try {
        const res = await axios.get<SubscriptionPlanModel.SubscriptionPlanDetailResponse>(
          "/api/v1/subscription-plan/plan",
          { params: { id } }
        );
        if (res.status === 200) {
          this.response_detail_query_data = res.data.items[0] ?? null;
        }
      } catch (error) {
        console.error("Error fetching subscription plan detail:", error);
      } finally {
        this.loading = false;
      }
    },

    async CreateData(payload: SubscriptionPlanModel.SubscriptionPlanRequestBody) {
      this.loading = true;
      try {
        const res = await axios.post("/api/v1/subscription-plan/create", payload);
        if (res.status === 200) {
          await CallSwal({
            icon: "success",
            title: "ສຳເລັດ",
            text: "ເພີ່ມແພັກເກັດຄ່າບໍລິການສຳເລັດແລ້ວ",
            timer: 1500,
            showConfirmButton: false,
          });
          goPath("/subscription-plan");
          return true;
        }
        return false;
      } catch (error: any) {
        await CallSwal({
          icon: "error",
          title: "ຜິດພາດ",
          text: error.response?.data?.message ?? "ບໍ່ສາມາດເພີ່ມແພັກເກັດໄດ້",
        });
        return false;
      } finally {
        this.loading = false;
      }
    },

    async UpdateData(id: string | number, payload: SubscriptionPlanModel.SubscriptionPlanPatchRequest) {
      this.loading = true;
      try {
        const res = await axios.patch(`/api/v1/subscription-plan/plan/${id}/`, payload);
        if (res.status === 200) {
          await CallSwal({
            icon: "success",
            title: "ສຳເລັດ",
            text: "ອັບເດດຂໍ້ມູນສຳເລັດແລ້ວ",
            timer: 1500,
            showConfirmButton: false,
          });
          goPath("/subscription-plan");
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
  },
});
