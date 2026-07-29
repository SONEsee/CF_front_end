import axios from "@/helpers/axios";
import { ShipmentModel } from "../models";
import { CallSwal } from "~/composables/global";

export const UseShipmentStore = defineStore("shipment", {
  state() {
    return {
      loading: false,
      response_query_data: null as ShipmentModel.ShipmentListResponse["items"] | null,
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
        const res = await axios.get<ShipmentModel.ShipmentListResponse>(
          "/api/v1/shipment/shipment",
          {
            params: {
              page: this.request_query_data.page,
              limit: this.request_query_data.limit,
              order_id: this.request_query_data.order_id,
            },
          }
        );
        if (res.status === 200) {
          this.response_query_data = res.data.items;
        }
      } catch (error) {
        console.error("Error fetching shipment data:", error);
      } finally {
        this.request_query_data.loading = false;
        this.loading = false;
      }
    },

    async CreateData(payload: ShipmentModel.ShipmentRequestBody) {
      this.loading = true;
      try {
        const res = await axios.post("/api/v1/shipment/create", payload);
        if (res.status === 200) {
          await CallSwal({
            icon: "success",
            title: "ສຳເລັດ",
            text: "ບັນທຶກການຈັດສົ່ງສຳເລັດແລ້ວ",
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
          text: error.response?.data?.message ?? "ບໍ່ສາມາດບັນທຶກການຈັດສົ່ງໄດ້",
        });
        return false;
      } finally {
        this.loading = false;
      }
    },

    async UpdateData(id: string | number, payload: ShipmentModel.ShipmentPatchRequest) {
      this.loading = true;
      try {
        const res = await axios.patch(`/api/v1/shipment/shipment/${id}/`, payload);
        if (res.status === 200) {
          await CallSwal({
            icon: "success",
            title: "ສຳເລັດ",
            text: "ອັບເດດຂໍ້ມູນສຳເລັດແລ້ວ",
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
          text: error.response?.data?.message ?? "ບໍ່ສາມາດອັບເດດຂໍ້ມູນໄດ້",
        });
        return false;
      } finally {
        this.loading = false;
      }
    },

    async UpdateStatus(id: string | number, status: ShipmentModel.ShipmentStatusRequest["status"]) {
      this.loading = true;
      try {
        const res = await axios.patch(`/api/v1/shipment/shipment/${id}/status`, { status });
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
