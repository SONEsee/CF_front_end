import axios from "@/helpers/axios";
import { ProductModel } from "../models";
import { CallSwal, goPath } from "~/composables/global";

export const UseProductStore = defineStore("product", {
  state() {
    return {
      loading: false,
      response_query_data: null as ProductModel.ProductListResponse["items"] | null,
      response_detail_query_data: null as ProductModel.Product | null,
      request_query_data: {
        q: null as string | null,
        category_id: null as number | null,
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
        const res = await axios.get<ProductModel.ProductListResponse>(
          "/api/v1/product/product",
          {
            params: {
              page: this.request_query_data.page,
              limit: this.request_query_data.limit,
              q: this.request_query_data.q,
              category_id: this.request_query_data.category_id,
            },
          }
        );
        if (res.status === 200) {
          this.response_query_data = res.data.items;
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
      } finally {
        this.request_query_data.loading = false;
        this.loading = false;
      }
    },

    async GetDetailData(id: string | number) {
      this.loading = true;
      try {
        const res = await axios.get<ProductModel.ProductDetailResponse>(
          "/api/v1/product/product",
          { params: { id } }
        );
        if (res.status === 200) {
          this.response_detail_query_data = res.data.items[0] ?? null;
        }
      } catch (error) {
        console.error("Error fetching product detail:", error);
      } finally {
        this.loading = false;
      }
    },

    async CreateData(payload: ProductModel.ProductRequestBody) {
      this.loading = true;
      try {
        const res = await axios.post("/api/v1/product/create", payload);
        if (res.status === 200) {
          await CallSwal({
            icon: "success",
            title: "ສຳເລັດ",
            text: "ເພີ່ມສິນຄ້າສຳເລັດແລ້ວ",
            timer: 1500,
            showConfirmButton: false,
          });
          goPath("/product");
          return true;
        }
        return false;
      } catch (error: any) {
        await CallSwal({
          icon: "error",
          title: "ຜິດພາດ",
          text: error.response?.data?.message ?? "ບໍ່ສາມາດເພີ່ມສິນຄ້າໄດ້",
        });
        return false;
      } finally {
        this.loading = false;
      }
    },

    async UpdateData(id: string | number, payload: ProductModel.ProductPatchRequest) {
      this.loading = true;
      try {
        const res = await axios.patch(`/api/v1/product/product/${id}/`, payload);
        if (res.status === 200) {
          await CallSwal({
            icon: "success",
            title: "ສຳເລັດ",
            text: "ອັບເດດຂໍ້ມູນສຳເລັດແລ້ວ",
            timer: 1500,
            showConfirmButton: false,
          });
          goPath("/product");
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
          text: "ທ່ານກຳລັງລົບສິນຄ້ານີ້ ທ່ານແນ່ໃຈແລ້ວບໍ່?",
          showCancelButton: true,
          confirmButtonText: "ຕົກລົງ",
          cancelButtonText: "ຍົກເລີກ",
        });
        if (!notification.isConfirmed) return;

        this.loading = true;
        const res = await axios.delete(`/api/v1/product/product/${id}/`);
        if (res.status === 200) {
          await this.GetListData();
        }
      } catch (error) {
        console.error("Error deleting product:", error);
      } finally {
        this.loading = false;
      }
    },
  },
});

// ⚠️ DEPRECATED — ຮັກສາໄວ້ພຽງໃຫ້ components/Home/Home.vue (ໜ້າ POS ເກົ່າ, ອ້າງອີງ field
// price/barcode/quantity_in_stock ທີ່ບໍ່ມີຢູ່ໃນ backend ປັດຈຸບັນ) compile ຜ່ານ — ບໍ່ດຶງຂໍ້ມູນຈິງ.
// ຫ້າມໃຊ້ໃນ code ໃໝ່ໃດໆ, ໃຫ້ໃຊ້ UseProductStore ແທນ.
export const useProductStore = defineStore("product-legacy", {
  state: () => ({
    response_query_data: null as { Items: any[] } | null,
  }),
  actions: {
    async Getdata() {
      console.warn("useProductStore (legacy) is deprecated and non-functional against the current backend.");
    },
  },
});
