export interface MainMenuRequestBody {
  module_id: number;
  menu_name: string;
  icon_class?: string;
}

export interface MainMenuPatchRequest {
  module_id?: number | null;
  menu_name?: string;
  icon_class?: string;
}

export interface MainMenu {
  id: number;
  module_id: number;
  menu_name: string;
  icon_class: string;
}

export interface Pagination {
  current_page: number;
  current_page_total_item: number;
  total_page: number;
  total_items: number;
}

export interface MainMenuListResponse {
  timestamp: string;
  status: number;
  items: {
    list_data: MainMenu[];
    pagination: Pagination;
  };
}

export interface MainMenuDetailResponse {
  timestamp: string;
  status: number;
  message: string;
  items: MainMenu[];
}

export interface MainMenuOption {
  id: number;
  menu_name: string;
}

// /api/v1/main/main-menu-options — ບໍ່ມີ pagination, ໃຊ້ສຳລັບ dropdown/autocomplete
export interface MainMenuOptionsResponse {
  timestamp: string;
  status: number;
  message: string;
  items: MainMenuOption[];
}
