import axios from "@/helpers/axios";
import { OrderModel } from "../models";
import { CallSwal, goPath } from "~/composables/global";

export const UseOrderStore = defineStore("order", {
  state() {
    return {
      loading: false,
      response_query_data: null as OrderModel.OrderListResponse["items"] | null,
      response_detail_query_data: null as OrderModel.Order | null,
      request_query_data: {
        q: null as string | null,
        shop_id: null as number | null,
        status: null as OrderModel.OrderStatus | null,
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
        const res = await axios.get<OrderModel.OrderListResponse>("/api/v1/order/order", {
          params: {
            page: this.request_query_data.page,
            limit: this.request_query_data.limit,
            q: this.request_query_data.q,
            shop_id: this.request_query_data.shop_id,
            status: this.request_query_data.status,
          },
        });
        if (res.status === 200) {
          this.response_query_data = res.data.items;
        }
      } catch (error) {
        console.error("Error fetching order data:", error);
      } finally {
        this.request_query_data.loading = false;
        this.loading = false;
      }
    },

    async GetDetailData(id: string | number) {
      this.loading = true;
      try {
        const res = await axios.get<OrderModel.OrderDetailResponse>("/api/v1/order/order", {
          params: { id },
        });
        if (res.status === 200) {
          this.response_detail_query_data = res.data.items[0] ?? null;
        }
      } catch (error) {
        console.error("Error fetching order detail:", error);
      } finally {
        this.loading = false;
      }
    },

    async CreateOrder(payload: OrderModel.OrderRequestBody) {
      this.loading = true;
      try {
        const res = await axios.post<OrderModel.OrderCreateResponse>("/api/v1/order/create", payload);
        if (res.status === 200) {
          await CallSwal({
            icon: "success",
            title: "ສຳເລັດ",
            text: "ສ້າງອໍເດີສຳເລັດແລ້ວ",
            timer: 1500,
            showConfirmButton: false,
          });
          goPath(`/order/detail?id=${res.data.items.order_id}`);
          return true;
        }
        return false;
      } catch (error: any) {
        await CallSwal({
          icon: "error",
          title: "ຜິດພາດ",
          text: error.response?.data?.message ?? "ບໍ່ສາມາດສ້າງອໍເດີໄດ້",
        });
        return false;
      } finally {
        this.loading = false;
      }
    },

    async UpdateStatus(id: string | number, status: OrderModel.OrderStatus, note?: string) {
      this.loading = true;
      try {
        const res = await axios.patch(`/api/v1/order/order/${id}/status`, { status, note });
        if (res.status === 200) {
          await CallSwal({
            icon: "success",
            title: "ສຳເລັດ",
            text: "ປ່ຽນສະຖານະສຳເລັດແລ້ວ",
            timer: 1500,
            showConfirmButton: false,
          });
          await this.GetDetailData(id);
          return true;
        }
        return false;
      } catch (error: any) {
        await CallSwal({
          icon: "error",
          title: "ປ່ຽນສະຖານະບໍ່ໄດ້",
          text: error.response?.data?.message ?? "ບໍ່ສາມາດປ່ຽນສະຖານະໄດ້",
        });
        return false;
      } finally {
        this.loading = false;
      }
    },
  },
});
