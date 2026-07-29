import axios from "@/helpers/axios";
import { RefundModel } from "../models";
import { CallSwal } from "~/composables/global";

export const UseRefundStore = defineStore("refund", {
  state() {
    return {
      loading: false,
      response_query_data: null as RefundModel.RefundListResponse["items"] | null,
      request_query_data: {
        order_id: null as number | null,
        limit: 100,
        page: 1,
        loading: false,
      },
    };
  },
  actions: {
    async GetListData() {
      if (!this.request_query_data.order_id) return;
      this.loading = true;
      this.request_query_data.loading = true;
      try {
        const res = await axios.get<RefundModel.RefundListResponse>("/api/v1/refund/refund", {
          params: {
            page: this.request_query_data.page,
            limit: this.request_query_data.limit,
            order_id: this.request_query_data.order_id,
          },
        });
        if (res.status === 200) {
          this.response_query_data = res.data.items;
        }
      } catch (error) {
        console.error("Error fetching refund data:", error);
      } finally {
        this.request_query_data.loading = false;
        this.loading = false;
      }
    },

    async CreateData(payload: RefundModel.RefundRequestBody) {
      this.loading = true;
      try {
        const res = await axios.post("/api/v1/refund/create", payload);
        if (res.status === 200) {
          await CallSwal({
            icon: "success",
            title: "ສຳເລັດ",
            text: "ສ້າງຄຳຮ້ອງຄືນເງິນສຳເລັດແລ້ວ",
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
          text: error.response?.data?.message ?? "ບໍ່ສາມາດສ້າງຄຳຮ້ອງຄືນເງິນໄດ້",
        });
        return false;
      } finally {
        this.loading = false;
      }
    },

    async UpdateStatus(id: string | number, status: RefundModel.RefundStatusRequest["status"]) {
      this.loading = true;
      try {
        const res = await axios.patch(`/api/v1/refund/refund/${id}/status`, { status });
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
