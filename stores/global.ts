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
        const res = await axios.get(fileLink, {
          responseType: "blob", 
        });
        // const res = await axios.get("", {
        //   params: {
        //     q: fileLink,
        //   },
        //   responseType: "blob",
        // });

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
