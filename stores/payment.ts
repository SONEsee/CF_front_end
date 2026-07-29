import axios from "@/helpers/axios";
import { PaymentModel } from "../models";
import { CallSwal } from "~/composables/global";
import { UseUploadStore } from "./upload";

export const UsePaymentStore = defineStore("payment", {
  state() {
    return {
      loading: false,
      response_query_data: null as PaymentModel.PaymentListResponse["items"] | null,
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
        const res = await axios.get<PaymentModel.PaymentListResponse>(
          "/api/v1/payment/payment",
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
        console.error("Error fetching payment data:", error);
      } finally {
        this.request_query_data.loading = false;
        this.loading = false;
      }
    },

    async CreateData(payload: PaymentModel.PaymentRequestBody) {
      this.loading = true;
      try {
        const res = await axios.post("/api/v1/payment/create", payload);
        if (res.status === 200) {
          await CallSwal({
            icon: "success",
            title: "ສຳເລັດ",
            text: "ບັນທຶກການຊຳລະເງິນສຳເລັດແລ້ວ",
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
          text: error.response?.data?.message ?? "ບໍ່ສາມາດບັນທຶກການຊຳລະໄດ້",
        });
        return false;
      } finally {
        this.loading = false;
      }
    },

    // ອັບໂຫຼດສະລິບຜ່ານ UseUploadStore ກ່ອນ ແລ້ວຄ່ອຍສ້າງແຖວ payment ດ້ວຍ path ທີ່ໄດ້
    async UploadAndCreate(
      file: File,
      payload: Omit<PaymentModel.PaymentRequestBody, "slip_image_path">
    ) {
      const uploadStore = UseUploadStore();
      const url = await uploadStore.UploadImage(file, "payment");
      if (!url) return false;
      return this.CreateData({ ...payload, slip_image_path: url });
    },

    async VerifyPayment(id: string | number, req: PaymentModel.PaymentVerifyRequest) {
      this.loading = true;
      try {
        const res = await axios.patch(`/api/v1/payment/payment/${id}/verify`, req);
        if (res.status === 200) {
          await CallSwal({
            icon: "success",
            title: "ສຳເລັດ",
            text: "ຢືນຢັນການຊຳລະສຳເລັດແລ້ວ",
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
          text: error.response?.data?.message ?? "ບໍ່ສາມາດຢືນຢັນການຊຳລະໄດ້",
        });
        return false;
      } finally {
        this.loading = false;
      }
    },
  },
});
