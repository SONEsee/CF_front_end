import axios from "@/helpers/axios";
import notfoundImage from "@/assets/img/404.png";

export const UseGlobalStore = defineStore("global", {
  state() {
    return {
      loading_overlay: false,
    };
  },
  actions: {
    async GetFileData(fileLink: string | File) {
      try {
        if (!fileLink) {
          return "";
        }

        if (typeof fileLink === "object") {
          return URL.createObjectURL(fileLink) ?? "";
        }

        // ລິ້ງພາຍນອກ (http/https ເຕັມ) — ໃຊ້ fetch() ທຳມະດາ, ບໍ່ຜ່ານ axios instance
        // ຂອງເຮົາ ເພື່ອບໍ່ໃຫ້ຕິດ Authorization Bearer token ໄປນຳ (token leak ຫາ host ພາຍນອກ)
        if (/^https?:\/\//i.test(fileLink)) {
          const res = await fetch(fileLink);
          if (res.ok) {
            return URL.createObjectURL(await res.blob());
          }
          return notfoundImage;
        }

        const res = await axios.get(fileLink, {
          responseType: "blob",
        });

        if (res.status === 200) {
          return URL.createObjectURL(res.data);
        }
        return notfoundImage;
      } catch (error) {
        console.error(error);
        return notfoundImage;
      }
    },
  },
  getters: {},
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(UseGlobalStore, import.meta.hot));
}
