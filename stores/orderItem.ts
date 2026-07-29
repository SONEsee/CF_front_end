import axios from "@/helpers/axios";
import { OrderItemModel } from "../models";

// order_item ບໍ່ມີ create/update ແຍກ — ຖືກສ້າງເປັນສ່ວນໜຶ່ງຂອງ order ເທົ່ານັ້ນ, ບໍ່ແກ້ໄຂໄດ້
export const UseOrderItemStore = defineStore("orderItem", {
  state() {
    return {
      loading: false,
      response_query_data: null as OrderItemModel.OrderItemListResponse["items"] | null,
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
        const res = await axios.get<OrderItemModel.OrderItemListResponse>(
          "/api/v1/order-item/order-item",
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
        console.error("Error fetching order item data:", error);
      } finally {
        this.request_query_data.loading = false;
        this.loading = false;
      }
    },
  },
});
