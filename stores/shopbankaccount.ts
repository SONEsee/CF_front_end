import axios from "@/helpers/axios";
import { ShopBankAccountModel } from "../models";
import { CallSwal, goPath } from "~/composables/global";

export const UseShopBankAccountStore = defineStore("shopbankaccount", {
  state() {
    return {
      loading: false,
      response_query_data: null as ShopBankAccountModel.ShopBankAccountListResponse["items"] | null,
      response_detail_query_data: null as ShopBankAccountModel.ShopBankAccount | null,
      request_query_data: {
        q: null as string | null,
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
        const res = await axios.get<ShopBankAccountModel.ShopBankAccountListResponse>(
          "/api/v1/shop-bank-account/bank-account",
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
        console.error("Error fetching shop bank account data:", error);
      } finally {
        this.request_query_data.loading = false;
        this.loading = false;
      }
    },

    async GetDetailData(id: string | number) {
      this.loading = true;
      try {
        const res = await axios.get<ShopBankAccountModel.ShopBankAccountDetailResponse>(
          "/api/v1/shop-bank-account/bank-account",
          { params: { id } }
        );
        if (res.status === 200) {
          this.response_detail_query_data = res.data.items[0] ?? null;
        }
      } catch (error) {
        console.error("Error fetching shop bank account detail:", error);
      } finally {
        this.loading = false;
      }
    },

    async CreateData(payload: ShopBankAccountModel.ShopBankAccountRequestBody) {
      this.loading = true;
      try {
        const res = await axios.post("/api/v1/shop-bank-account/create", payload);
        if (res.status === 200) {
          await CallSwal({
            icon: "success",
            title: "ສຳເລັດ",
            text: "ເພີ່ມບັນຊີທະນາຄານສຳເລັດແລ້ວ",
            timer: 1500,
            showConfirmButton: false,
          });
          goPath("/shop-bank-account");
          return true;
        }
        return false;
      } catch (error: any) {
        await CallSwal({
          icon: "error",
          title: "ຜິດພາດ",
          text: error.response?.data?.message ?? "ບໍ່ສາມາດເພີ່ມບັນຊີທະນາຄານໄດ້",
        });
        return false;
      } finally {
        this.loading = false;
      }
    },

    async UpdateData(id: string | number, payload: ShopBankAccountModel.ShopBankAccountPatchRequest) {
      this.loading = true;
      try {
        const res = await axios.patch(`/api/v1/shop-bank-account/bank-account/${id}/`, payload);
        if (res.status === 200) {
          await CallSwal({
            icon: "success",
            title: "ສຳເລັດ",
            text: "ອັບເດດຂໍ້ມູນສຳເລັດແລ້ວ",
            timer: 1500,
            showConfirmButton: false,
          });
          goPath("/shop-bank-account");
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
          text: "ທ່ານກຳລັງປິດການໃຊ້ງານບັນຊີທະນາຄານນີ້ ທ່ານແນ່ໃຈແລ້ວບໍ່?",
          showCancelButton: true,
          confirmButtonText: "ຕົກລົງ",
          cancelButtonText: "ຍົກເລີກ",
        });
        if (!notification.isConfirmed) return;

        this.loading = true;
        const res = await axios.delete(`/api/v1/shop-bank-account/bank-account/${id}/`);
        if (res.status === 200) {
          await this.GetListData();
        }
      } catch (error) {
        console.error("Error deactivating shop bank account:", error);
      } finally {
        this.loading = false;
      }
    },
  },
});
