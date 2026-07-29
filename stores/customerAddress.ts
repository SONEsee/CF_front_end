import axios from "@/helpers/axios";
import { CustomerAddressModel } from "../models";
import { CallSwal } from "~/composables/global";

export const UseCustomerAddressStore = defineStore("customerAddress", {
  state() {
    return {
      loading: false,
      response_query_data: null as CustomerAddressModel.CustomerAddressListResponse["items"] | null,
      request_query_data: {
        customer_id: null as number | null,
        limit: 100,
        page: 1,
        loading: false,
      },
    };
  },
  actions: {
    async GetListData() {
      if (!this.request_query_data.customer_id) return;
      this.loading = true;
      this.request_query_data.loading = true;
      try {
        const res = await axios.get<CustomerAddressModel.CustomerAddressListResponse>(
          "/api/v1/customer-address/address",
          {
            params: {
              page: this.request_query_data.page,
              limit: this.request_query_data.limit,
              customer_id: this.request_query_data.customer_id,
            },
          }
        );
        if (res.status === 200) {
          this.response_query_data = res.data.items;
        }
      } catch (error) {
        console.error("Error fetching customer address data:", error);
      } finally {
        this.request_query_data.loading = false;
        this.loading = false;
      }
    },

    async CreateData(payload: CustomerAddressModel.CustomerAddressRequestBody) {
      this.loading = true;
      try {
        const res = await axios.post("/api/v1/customer-address/create", payload);
        if (res.status === 200) {
          await CallSwal({
            icon: "success",
            title: "ສຳເລັດ",
            text: "ເພີ່ມທີ່ຢູ່ສຳເລັດແລ້ວ",
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
          text: error.response?.data?.message ?? "ບໍ່ສາມາດເພີ່ມທີ່ຢູ່ໄດ້",
        });
        return false;
      } finally {
        this.loading = false;
      }
    },

    async UpdateData(id: string | number, payload: CustomerAddressModel.CustomerAddressPatchRequest) {
      this.loading = true;
      try {
        const res = await axios.patch(`/api/v1/customer-address/address/${id}/`, payload);
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

    async DeleteData(id: string | number) {
      try {
        const notification = await CallSwal({
          icon: "warning",
          title: "ຄຳເຕືອນ",
          text: "ທ່ານກຳລັງລົບທີ່ຢູ່ນີ້ ທ່ານແນ່ໃຈແລ້ວບໍ່?",
          showCancelButton: true,
          confirmButtonText: "ຕົກລົງ",
          cancelButtonText: "ຍົກເລີກ",
        });
        if (!notification.isConfirmed) return;

        this.loading = true;
        const res = await axios.delete(`/api/v1/customer-address/address/${id}/`);
        if (res.status === 200) {
          await this.GetListData();
        }
      } catch (error: any) {
        if (error.response?.status === 409) {
          await CallSwal({
            icon: "error",
            title: "ລົບບໍ່ໄດ້",
            text: error.response?.data?.message ?? "ບໍ່ສາມາດລົບທີ່ຢູ່ຫຼັກໄດ້",
          });
        } else {
          console.error("Error deleting customer address:", error);
        }
      } finally {
        this.loading = false;
      }
    },

    // ຕັ້ງເປັນທີ່ຢູ່ຫຼັກ — ເອີ້ນຜ່ານ customer endpoint (ບໍ່ແມ່ນ address endpoint)
    async SetDefault(customerId: string | number, addressId: number) {
      this.loading = true;
      try {
        const res = await axios.patch(`/api/v1/customer/customer/${customerId}/default-address`, {
          address_id: addressId,
        });
        if (res.status === 200) {
          await this.GetListData();
          return true;
        }
        return false;
      } catch (error: any) {
        await CallSwal({
          icon: "error",
          title: "ຜິດພາດ",
          text: error.response?.data?.message ?? "ບໍ່ສາມາດຕັ້ງທີ່ຢູ່ຫຼັກໄດ້",
        });
        return false;
      } finally {
        this.loading = false;
      }
    },
  },
});
