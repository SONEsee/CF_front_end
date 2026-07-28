import axios from "@/helpers/axios";
import { UserModel } from "../models";
import { CallSwal, goPath } from "~/composables/global";

export const UserStore = defineStore("user", {
  state() {
    return {
      loading: false,
      login_loading: false,
      response_query_data: null as UserModel.UserListResponse["items"] | null,
      response_detail_query_data: null as UserModel.User | null,
      request_query_data: {
        q: null as string | null,
        limit: 20,
        page: 1,
        loading: false,
      },
    };
  },
  actions: {
    async Login(payload: UserModel.UserLoginRequest) {
      this.login_loading = true;
      try {
        const res = await axios.post<UserModel.UserLoginResponse>(     
          "/api/v1/auth/login",
          payload,
        );

        if (res.data.status === 1) {
          const user = res.data.items;
          localStorage.setItem("token", user.token ?? "");
          localStorage.setItem("user", JSON.stringify(user));
          return { success: true, message: res.data.message, user };
        }

        return { success: false, message: res.data.message };
      } finally {
        this.login_loading = false;
      }
    },

    async GetListData() {
      this.loading = true;
      this.request_query_data.loading = true;
      try {
        const res = await axios.get<UserModel.UserListResponse>(
          "/api/v1/users/getData",
          {
            params: {
              page: this.request_query_data.page,
              limit: this.request_query_data.limit,
              q: this.request_query_data.q,
            },
          },
        );
        if (res.status === 200) {
          this.response_query_data = res.data.items;
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        this.request_query_data.loading = false;
        this.loading = false;
      }
    },

    async GetDetailData(id: string | number) {
      this.loading = true;
      try {
        const res = await axios.get<UserModel.UserDetailResponse>(
          "/api/v1/users/getData",
          { params: { id } },
        );
        if (res.status === 200) {
          this.response_detail_query_data = res.data.items[0] ?? null;
        }
      } catch (error) {
        console.error("Error fetching user detail:", error);
      } finally {
        this.loading = false;
      }
    },

    async CreateData(payload: FormData) {
      this.loading = true;
      try {
        const res = await axios.post("/api/v1/users/create", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (res.status === 200) {
          await CallSwal({
            icon: "success",
            title: "ສຳເລັດ",
            text: "ເພີ່ມຜູ້ໃຊ້ງານສຳເລັດແລ້ວ",
            timer: 1500,
            showConfirmButton: false,
          });
          goPath("/user");
          return true;
        }
        return false;
      } catch (error: any) {
        await CallSwal({
          icon: "error",
          title: "ຜິດພາດ",
          text: error.response?.data?.message ?? "ບໍ່ສາມາດເພີ່ມຜູ້ໃຊ້ງານໄດ້",
        });
        return false;
      } finally {
        this.loading = false;
      }
    },

    async UpdateData(id: string | number, payload: FormData) {
      this.loading = true;
      try {
        const res = await axios.patch(`/api/v1/users/user-update/${id}`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (res.status === 200) {
          await CallSwal({
            icon: "success",
            title: "ສຳເລັດ",
            text: "ອັບເດດຂໍ້ມູນສຳເລັດແລ້ວ",
            timer: 1500,
            showConfirmButton: false,
          });
          goPath("/user");
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
          title: "ລຶບຜູ້ໃຊ້",
          text: "ທ່ານແນ່ໃຈແລ້ວບໍ່ທີ່ຈະລຶບຜູ້ໃຊ້ນີ້ ?",
          showCancelButton: true,
          confirmButtonText: "ຕົກລົງ",
          cancelButtonText: "ຍົກເລີກ",
        });
        if (!notification.isConfirmed) return;

        this.loading = true;
        const res = await axios.delete(`/api/v1/users/deleted/${id}`);
        if (res.status === 200) {
          await CallSwal({
            icon: "success",
            title: "ສຳເລັດ",
            text: "ລຶບຜູ້ໃຊ້ງານສຳເລັດແລ້ວ",
            timer: 1500,
            showConfirmButton: false,
          });
          await this.GetListData();
        }
      } catch (error: any) {
        await CallSwal({
          icon: "error",
          title: "ຜິດພາດ",
          text: error.response?.data?.message ?? "ບໍ່ສາມາດລຶບຜູ້ໃຊ້ງານໄດ້",
        });
      } finally {
        this.loading = false;
      }
    },

    // ສະຫຼັບສະຖານະ ເປີດ/ປິດ ການໃຊ້ງານ (ໃຊ້ຢູ່ໜ້າ detail)
    async ToggleStatus(id: string | number, isActive: boolean) {
      this.loading = true;
      try {
        const res = await axios.patch(`/api/v1/users/toggle-status/${id}`, {
          is_active: isActive,
        });
        if (res.status === 200) {
          await CallSwal({
            icon: "success",
            title: "ສຳເລັດ",
            text: isActive ? "ເປີດໃຊ້ງານສຳເລັດແລ້ວ" : "ປິດໃຊ້ງານສຳເລັດແລ້ວ",
            timer: 1200,
            showConfirmButton: false,
          });
          return true;
        }
        return false;
      } catch (error: any) {
        await CallSwal({
          icon: "error",
          title: "ຜິດພາດ",
          text: error.response?.data?.message ?? "ບໍ່ສາມາດປ່ຽນສະຖານະໄດ້",
        });
        return false;
      } finally {
        this.loading = false;
      }
    },
  },
  
  
});
