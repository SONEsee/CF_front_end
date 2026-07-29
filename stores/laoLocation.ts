import axios from "@/helpers/axios";

export interface LaoProvinceOption {
  id: number;
  name: string;
}

export interface LaoDistrictOption {
  id: number;
  province_id: number;
  name: string;
}

export interface LaoVillageOption {
  id: number;
  district_id: number;
  name: string;
}

interface OptionsResponse<T> {
  timestamp: string;
  status: number;
  message: string;
  items: T[];
}

export const UseLaoLocationStore = defineStore("laoLocation", {
  state() {
    return {
      province_options: [] as LaoProvinceOption[],
      province_options_loading: false,
      province_options_loaded: false,
      district_options: [] as LaoDistrictOption[],
      district_options_loading: false,
      village_options: [] as LaoVillageOption[],
      village_options_loading: false,
    };
  },
  actions: {
    // ແຂວງມີ 18 ລາຍການ ຄົງທີ່ — cache ຄັ້ງດຽວ ຄື GetShopOptions/GetCategoryOptions
    async GetProvinceOptions(force = false) {
      if (this.province_options_loaded && !force) return;
      this.province_options_loading = true;
      try {
        const res = await axios.get<OptionsResponse<LaoProvinceOption>>(
          "/api/v1/lao-location/province"
        );
        if (res.status === 200) {
          this.province_options = res.data.items ?? [];
          this.province_options_loaded = true;
        }
      } catch (error) {
        console.error("Error fetching lao province options:", error);
      } finally {
        this.province_options_loading = false;
      }
    },

    // ເມືອງຂຶ້ນກັບແຂວງ — ບໍ່ cache ຖາວອນ, ດຶງໃໝ່ທຸກຄັ້ງທີ່ provinceId ປ່ຽນ
    async GetDistrictOptions(provinceId: number) {
      this.district_options_loading = true;
      try {
        const res = await axios.get<OptionsResponse<LaoDistrictOption>>(
          "/api/v1/lao-location/district",
          { params: { province_id: provinceId } }
        );
        if (res.status === 200) {
          this.district_options = res.data.items ?? [];
        }
      } catch (error) {
        console.error("Error fetching lao district options:", error);
      } finally {
        this.district_options_loading = false;
      }
    },

    // ບ້ານຂຶ້ນກັບເມືອງ — ບໍ່ cache ຖາວອນ, ດຶງໃໝ່ທຸກຄັ້ງທີ່ districtId ປ່ຽນ
    async GetVillageOptions(districtId: number) {
      this.village_options_loading = true;
      try {
        const res = await axios.get<OptionsResponse<LaoVillageOption>>(
          "/api/v1/lao-location/village",
          { params: { district_id: districtId } }
        );
        if (res.status === 200) {
          this.village_options = res.data.items ?? [];
        }
      } catch (error) {
        console.error("Error fetching lao village options:", error);
      } finally {
        this.village_options_loading = false;
      }
    },
  },
});
