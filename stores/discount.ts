import axios from "@/helpers/axios";
import { DiscountModel } from "../models";
import { CallSwal, goPath } from "~/composables/global";

export const UseDiscountStore = defineStore("discount", {
  state() {
    return {
      loading: false,
      response_query_data: null as DiscountModel.DiscountListResponse["items"] | null,
      response_detail_query_data: null as DiscountModel.Discount | null,
      request_query_data: {
        q: null as string | null,
        shop_id: null as number | null,
        limit: 20,
        page: 1,
        loading: false,
      },
      discount_options: [] as DiscountModel.Discount[],
      discount_options_loading: false,
    };
  },
  actions: {
    async GetListData() {
      this.loading = true;
      this.request_query_data.loading = true;
      try {
        const res = await axios.get<DiscountModel.DiscountListResponse>(
          "/api/v1/discount/discount",
          {
            params: {
              page: this.request_query_data.page,
              limit: this.request_query_data.limit,
              q: this.request_query_data.q,
              shop_id: this.request_query_data.shop_id,
            },
          }
        );
        if (res.status === 200) {
          this.response_query_data = res.data.items;
        }
      } catch (error) {
        console.error("Error fetching discount data:", error);
      } finally {
        this.request_query_data.loading = false;
        this.loading = false;
      }
    },

    // ໃຊ້ສຳລັບ dropdown ເລືອກ discount ຕອນສ້າງ order (ດຶງທັງໝົດຂອງຮ້ານໜຶ່ງ, ບໍ່ paginate)
    async GetDiscountOptionsByShop(shopId: number) {
      this.discount_options_loading = true;
      try {
        const res = await axios.get<DiscountModel.DiscountDetailResponse>(
          "/api/v1/discount/discount",
          { params: { shop_id: shopId } }
        );
        if (res.status === 200) {
          this.discount_options = (res.data.items ?? []).filter((d) => d.is_active);
        }
      } catch (error) {
        console.error("Error fetching discount options:", error);
      } finally {
        this.discount_options_loading = false;
      }
    },

    async GetDetailData(id: string | number) {
      this.loading = true;
      try {
        const res = await axios.get<DiscountModel.DiscountDetailResponse>(
          "/api/v1/discount/discount",
          { params: { id } }
        );
        if (res.status === 200) {
          this.response_detail_query_data = res.data.items[0] ?? null;
        }
      } catch (error) {
        console.error("Error fetching discount detail:", error);
      } finally {
        this.loading = false;
      }
    },

    async CreateData(payload: DiscountModel.DiscountRequestBody) {
      this.loading = true;
      try {
        const res = await axios.post("/api/v1/discount/create", payload);
        if (res.status === 200) {
          await CallSwal({
            icon: "success",
            title: "ສຳເລັດ",
            text: "ເພີ່ມສ່ວນຫຼຸດສຳເລັດແລ້ວ",
            timer: 1500,
            showConfirmButton: false,
          });
          goPath("/discount");
          return true;
        }
        return false;
      } catch (error: any) {
        await CallSwal({
          icon: "error",
          title: "ຜິດພາດ",
          text: error.response?.data?.message ?? "ບໍ່ສາມາດເພີ່ມສ່ວນຫຼຸດໄດ້",
        });
        return false;
      } finally {
        this.loading = false;
      }
    },

    async UpdateData(id: string | number, payload: DiscountModel.DiscountPatchRequest) {
      this.loading = true;
      try {
        const res = await axios.patch(`/api/v1/discount/discount/${id}/`, payload);
        if (res.status === 200) {
          await CallSwal({
            icon: "success",
            title: "ສຳເລັດ",
            text: "ອັບເດດຂໍ້ມູນສຳເລັດແລ້ວ",
            timer: 1500,
            showConfirmButton: false,
          });
          goPath("/discount");
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
          text: "ທ່ານກຳລັງປິດການໃຊ້ງານສ່ວນຫຼຸດນີ້ ທ່ານແນ່ໃຈແລ້ວບໍ່?",
          showCancelButton: true,
          confirmButtonText: "ຕົກລົງ",
          cancelButtonText: "ຍົກເລີກ",
        });
        if (!notification.isConfirmed) return;

        this.loading = true;
        const res = await axios.delete(`/api/v1/discount/discount/${id}/`);
        if (res.status === 200) {
          await this.GetListData();
        }
      } catch (error) {
        console.error("Error deactivating discount:", error);
      } finally {
        this.loading = false;
      }
    },
  },
});
