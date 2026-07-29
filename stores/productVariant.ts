import axios from "@/helpers/axios";
import { ProductVariantModel } from "../models";
import { CallSwal } from "~/composables/global";

export const UseProductVariantStore = defineStore("productVariant", {
  state() {
    return {
      loading: false,
      response_query_data: null as ProductVariantModel.ProductVariantListResponse["items"] | null,
      request_query_data: {
        product_id: null as number | null,
        limit: 100,
        page: 1,
        loading: false,
      },
    };
  },
  actions: {
    async GetListData() {
      if (!this.request_query_data.product_id) return;
      this.loading = true;
      this.request_query_data.loading = true;
      try {
        const res = await axios.get<ProductVariantModel.ProductVariantListResponse>(
          "/api/v1/product-variant/variant",
          {
            params: {
              page: this.request_query_data.page,
              limit: this.request_query_data.limit,
              product_id: this.request_query_data.product_id,
            },
          }
        );
        if (res.status === 200) {
          this.response_query_data = res.data.items;
        }
      } catch (error) {
        console.error("Error fetching product variant data:", error);
      } finally {
        this.request_query_data.loading = false;
        this.loading = false;
      }
    },

    async CreateData(payload: ProductVariantModel.ProductVariantRequestBody) {
      this.loading = true;
      try {
        const res = await axios.post("/api/v1/product-variant/create", payload);
        if (res.status === 200) {
          await CallSwal({
            icon: "success",
            title: "ສຳເລັດ",
            text: "ເພີ່ມຕົວເລືອກສິນຄ້າສຳເລັດແລ້ວ",
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
          text: error.response?.data?.message ?? "ບໍ່ສາມາດເພີ່ມຕົວເລືອກສິນຄ້າໄດ້",
        });
        return false;
      } finally {
        this.loading = false;
      }
    },

    async UpdateData(id: string | number, payload: ProductVariantModel.ProductVariantPatchRequest) {
      this.loading = true;
      try {
        const res = await axios.patch(`/api/v1/product-variant/variant/${id}/`, payload);
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

    // DeactivateData ໃຊ້ແທນການລົບ (product_variants ບໍ່ມີ deleted_at) — set is_active=false
    async DeactivateData(id: string | number) {
      try {
        const notification = await CallSwal({
          icon: "warning",
          title: "ຄຳເຕືອນ",
          text: "ທ່ານກຳລັງປິດການໃຊ້ງານຕົວເລືອກສິນຄ້ານີ້ ທ່ານແນ່ໃຈແລ້ວບໍ່?",
          showCancelButton: true,
          confirmButtonText: "ຕົກລົງ",
          cancelButtonText: "ຍົກເລີກ",
        });
        if (!notification.isConfirmed) return;

        this.loading = true;
        const res = await axios.delete(`/api/v1/product-variant/variant/${id}/`);
        if (res.status === 200) {
          await this.GetListData();
        }
      } catch (error) {
        console.error("Error deactivating product variant:", error);
      } finally {
        this.loading = false;
      }
    },
  },
});
