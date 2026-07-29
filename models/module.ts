export interface ModuleRequestBody {
  module_name: string;
  display_order?: number;
}

export interface ModulePatchRequest {
  module_name?: string;
  display_order?: number;
}

export interface Module {
  id: number;
  module_name: string;
  display_order: number;
}

export interface Pagination {
  current_page: number;
  current_page_total_item: number;
  total_page: number;
  total_items: number;
}

export interface ModuleListResponse {
  timestamp: string;
  status: number;
  items: {
    list_data: Module[];
    pagination: Pagination;
  };
}

export interface ModuleDetailResponse {
  timestamp: string;
  status: number;
  message: string;
  items: Module[];
}

export interface ModuleOption {
  id: number;
  module_name: string;
}

// /api/v1/module/module-options — ບໍ່ມີ pagination, ໃຊ້ສຳລັບ dropdown/autocomplete
export interface ModuleOptionsResponse {
  timestamp: string;
  status: number;
  message: string;
  items: ModuleOption[];
}
