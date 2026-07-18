import axios from "@/helpers/axios";
import { CallSwal } from "~/composables/global";

interface UploadImageResponse {
  timestamp: string;
  status: number;
  message: string;
  items: {
    url: string;
  };
}

export const UseUploadStore = defineStore("upload", {
  state() {
    return {
      loading: false,
    };
  },
  actions: {
    // category ໃຊ້ຈັດໂຟນເດີຝັ່ງ backend (ເຊັ່ນ "shop", "product") — ຄືນ URL ຮູບ ຫຼື null ຖ້າຜິດພາດ
    async UploadImage(file: File, category: string): Promise<string | null> {
      this.loading = true;
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await axios.post<UploadImageResponse>(
          `/api/v1/upload/image?type=${encodeURIComponent(category)}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        if (res.status === 200) {
          return res.data.items.url;
        }
        return null;
      } catch (error: any) {
        await CallSwal({
          icon: "error",
          title: "ຜິດພາດ",
          text: error.response?.data?.message ?? "ອັບໂຫຼດຮູບພາບບໍ່ສຳເລັດ",
        });
        return null;
      } finally {
        this.loading = false;
      }
    },
  },
});
