import axios from "@/helpers/axios";
import { CustomerModel } from "../models";
import { CallSwal, goPath } from "~/composables/global";

export const UseCustomerStore = defineStore("customer", {
  state() {
    return {
      loading: false,
      response_query_data: null as CustomerModel.CustomerListResponse["items"] | null,
      response_detail_query_data: null as CustomerModel.Customer | null,
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
        const res = await axios.get<CustomerModel.CustomerListResponse>(
          "/api/v1/customer/customer",
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
        console.error("Error fetching customer data:", error);
      } finally {
        this.request_query_data.loading = false;
        this.loading = false;
      }
    },

    async GetDetailData(id: string | number) {
      this.loading = true;
      try {
        const res = await axios.get<CustomerModel.CustomerDetailResponse>(
          "/api/v1/customer/customer",
          { params: { id } }
        );
        if (res.status === 200) {
          this.response_detail_query_data = res.data.items[0] ?? null;
        }
      } catch (error) {
        console.error("Error fetching customer detail:", error);
      } finally {
        this.loading = false;
      }
    },

    async CreateData(payload: CustomerModel.CustomerRequestBody) {
      this.loading = true;
      try {
        const res = await axios.post("/api/v1/customer/create", payload);
        if (res.status === 200) {
          await CallSwal({
            icon: "success",
            title: "ສຳເລັດ",
            text: "ເພີ່ມລູກຄ້າສຳເລັດແລ້ວ",
            timer: 1500,
            showConfirmButton: false,
          });
          goPath("/customer");
          return true;
        }
        return false;
      } catch (error: any) {
        await CallSwal({
          icon: "error",
          title: "ຜິດພາດ",
          text: error.response?.data?.message ?? "ບໍ່ສາມາດເພີ່ມລູກຄ້າໄດ້",
        });
        return false;
      } finally {
        this.loading = false;
      }
    },

    async UpdateData(id: string | number, payload: CustomerModel.CustomerPatchRequest) {
      this.loading = true;
      try {
        const res = await axios.patch(`/api/v1/customer/customer/${id}/`, payload);
        if (res.status === 200) {
          await CallSwal({
            icon: "success",
            title: "ສຳເລັດ",
            text: "ອັບເດດຂໍ້ມູນສຳເລັດແລ້ວ",
            timer: 1500,
            showConfirmButton: false,
          });
          goPath("/customer");
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
          text: "ທ່ານກຳລັງລົບລູກຄ້ານີ້ ທ່ານແນ່ໃຈແລ້ວບໍ່?",
          showCancelButton: true,
          confirmButtonText: "ຕົກລົງ",
          cancelButtonText: "ຍົກເລີກ",
        });
        if (!notification.isConfirmed) return;

        this.loading = true;
        const res = await axios.delete(`/api/v1/customer/customer/${id}/`);
        if (res.status === 200) {
          await this.GetListData();
        }
      } catch (error: any) {
        if (error.response?.status === 409) {
          await CallSwal({
            icon: "error",
            title: "ລົບບໍ່ໄດ້",
            text: error.response?.data?.message ?? "ລູກຄ້ານີ້ຍັງມີປະຫວັດການສັ່ງຊື້ຢູ່",
          });
        } else {
          console.error("Error deleting customer:", error);
        }
      } finally {
        this.loading = false;
      }
    },
  },
});
