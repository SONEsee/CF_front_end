import axios from "@/helpers/axios";
import { ProductImageModel } from "../models";
import { CallSwal } from "~/composables/global";
import { UseUploadStore } from "./upload";

export const UseProductImageStore = defineStore("productImage", {
  state() {
    return {
      loading: false,
      response_query_data: null as ProductImageModel.ProductImageListResponse["items"] | null,
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
        const res = await axios.get<ProductImageModel.ProductImageListResponse>(
          "/api/v1/product-image/image",
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
        console.error("Error fetching product image data:", error);
      } finally {
        this.request_query_data.loading = false;
        this.loading = false;
      }
    },

    async CreateData(payload: ProductImageModel.ProductImageRequestBody) {
      this.loading = true;
      try {
        const res = await axios.post("/api/v1/product-image/create", payload);
        if (res.status === 200) {
          await this.GetListData();
          return true;
        }
        return false;
      } catch (error: any) {
        await CallSwal({
          icon: "error",
          title: "ຜິດພາດ",
          text: error.response?.data?.message ?? "ບໍ່ສາມາດເພີ່ມຮູບໄດ້",
        });
        return false;
      } finally {
        this.loading = false;
      }
    },

    // UploadAndCreate ອັບໂຫຼດຮູບຜ່ານ UseUploadStore ກ່ອນ ແລ້ວຄ່ອຍສ້າງແຖວ product_image ດ້ວຍ URL ທີ່ໄດ້
    async UploadAndCreate(file: File, productId: number, sortOrder = 0) {
      const uploadStore = UseUploadStore();
      const url = await uploadStore.UploadImage(file, "product");
      if (!url) return false;
      return this.CreateData({ product_id: productId, image_url: url, sort_order: sortOrder });
    },

    async DeleteData(id: string | number) {
      try {
        const notification = await CallSwal({
          icon: "warning",
          title: "ຄຳເຕືອນ",
          text: "ທ່ານກຳລັງລົບຮູບນີ້ ທ່ານແນ່ໃຈແລ້ວບໍ່?",
          showCancelButton: true,
          confirmButtonText: "ຕົກລົງ",
          cancelButtonText: "ຍົກເລີກ",
        });
        if (!notification.isConfirmed) return;

        this.loading = true;
        const res = await axios.delete(`/api/v1/product-image/image/${id}/`);
        if (res.status === 200) {
          await this.GetListData();
        }
      } catch (error) {
        console.error("Error deleting product image:", error);
      } finally {
        this.loading = false;
      }
    },
  },
});
