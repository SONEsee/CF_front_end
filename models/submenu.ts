export interface SubMenuRequestBody {
  main_menu_id: number;
  submenu_name: string;
  route_path?: string;
}

export interface SubMenuPatchRequest {
  main_menu_id?: number | null;
  submenu_name?: string;
  route_path?: string;
}

export interface SubMenu {
  id: number;
  main_menu_id: number;
  submenu_name: string;
  route_path: string;
}

// NOTE: total_page/total_items keys are swapped due to a backend bug in
// presenters.ResponseSuccessListData (see models/shop.ts for details).
export interface Pagination {
  current_page: number;
  current_page_total_item: number;
  total_page: number;
  total_items: number;
}

export interface SubMenuListResponse {
  timestamp: string;
  status: number;
  items: {
    list_data: SubMenu[];
    pagination: Pagination;
  };
}

export interface SubMenuDetailResponse {
  timestamp: string;
  status: number;
  message: string;
  items: SubMenu[];
}
