import axios from "@/helpers/axios";
import { CategoryModel } from "../models";
import { CallSwal, goPath } from "~/composables/global";

export const UseCategoryStore = defineStore("category", {
  state() {
    return {
      loading: false,
      response_query_data: null as CategoryModel.CategoryListResponse["items"] | null,
      response_detail_query_data: null as CategoryModel.Category | null,
      request_query_data: {
        q: null as string | null,
        limit: 20,
        page: 1,
        loading: false,
      },
      category_options: [] as CategoryModel.CategoryOption[],
      category_options_loading: false,
      category_options_loaded: false,
    };
  },
  actions: {
    async GetCategoryOptions(force = false) {
      if (this.category_options_loaded && !force) return;
      this.category_options_loading = true;
      try {
        const res = await axios.get<CategoryModel.CategoryOptionsResponse>(
          "/api/v1/product-category/category-options"
        );
        if (res.status === 200) {
          this.category_options = res.data.items ?? [];
          this.category_options_loaded = true;
        }
      } catch (error) {
        console.error("Error fetching category options:", error);
      } finally {
        this.category_options_loading = false;
      }
    },

    async GetListData() {
      this.loading = true;
      this.request_query_data.loading = true;
      try {
        const res = await axios.get<CategoryModel.CategoryListResponse>(
          "/api/v1/product-category/category",
          {
            params: {
              page: this.request_query_data.page,
              limit: this.request_query_data.limit,
              q: this.request_query_data.q,
            },
          }
        );
        if (res.status === 200) {
          this.response_query_data = res.data.items;
        }
      } catch (error) {
        console.error("Error fetching category data:", error);
      } finally {
        this.request_query_data.loading = false;
        this.loading = false;
      }
    },

    async GetDetailData(id: string | number) {
      this.loading = true;
      try {
        const res = await axios.get<CategoryModel.CategoryDetailResponse>(
          "/api/v1/product-category/category",
          { params: { id } }
        );
        if (res.status === 200) {
          this.response_detail_query_data = res.data.items[0] ?? null;
        }
      } catch (error) {
        console.error("Error fetching category detail:", error);
      } finally {
        this.loading = false;
      }
    },

    async CreateData(payload: CategoryModel.CategoryRequestBody) {
      this.loading = true;
      try {
        const res = await axios.post("/api/v1/product-category/create", payload);
        if (res.status === 200) {
          await CallSwal({
            icon: "success",
            title: "ສຳເລັດ",
            text: "ເພີ່ມໝວດໝູ່ສຳເລັດແລ້ວ",
            timer: 1500,
            showConfirmButton: false,
          });
          goPath("/category");
          return true;
        }
        return false;
      } catch (error: any) {
        await CallSwal({
          icon: "error",
          title: "ຜິດພາດ",
          text: error.response?.data?.message ?? "ບໍ່ສາມາດເພີ່ມໝວດໝູ່ໄດ້",
        });
        return false;
      } finally {
        this.loading = false;
      }
    },

    async UpdateData(id: string | number, payload: CategoryModel.CategoryPatchRequest) {
      this.loading = true;
      try {
        const res = await axios.patch(`/api/v1/product-category/category/${id}/`, payload);
        if (res.status === 200) {
          await CallSwal({
            icon: "success",
            title: "ສຳເລັດ",
            text: "ອັບເດດຂໍ້ມູນສຳເລັດແລ້ວ",
            timer: 1500,
            showConfirmButton: false,
          });
          goPath("/category");
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
          text: "ທ່ານກຳລັງລົບໝວດໝູ່ນີ້ ທ່ານແນ່ໃຈແລ້ວບໍ່?",
          showCancelButton: true,
          confirmButtonText: "ຕົກລົງ",
          cancelButtonText: "ຍົກເລີກ",
        });
        if (!notification.isConfirmed) return;

        this.loading = true;
        const res = await axios.delete(`/api/v1/product-category/category/${id}/`);
        if (res.status === 200) {
          await this.GetListData();
        }
      } catch (error) {
        console.error("Error deleting category:", error);
      } finally {
        this.loading = false;
      }
    },
  },
});
