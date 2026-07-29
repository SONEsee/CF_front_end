export interface PermissionRequestBody {
  role_id: number;
  submenu_id: number;
  can_view: boolean;
  can_create: boolean;
  can_update: boolean;
  can_delete: boolean;
}

export interface PermissionPatchRequest {
  can_view?: boolean;
  can_create?: boolean;
  can_update?: boolean;
  can_delete?: boolean;
}

export interface Permission {
  id: number;
  role_id: number;
  submenu_id: number;
  can_view: boolean;
  can_create: boolean;
  can_update: boolean;
  can_delete: boolean;
}

export interface Pagination {
  current_page: number;
  current_page_total_item: number;
  total_page: number;
  total_items: number;
}

export interface PermissionListResponse {
  timestamp: string;
  status: number;
  items: {
    list_data: Permission[];
    pagination: Pagination;
  };
}

export interface PermissionDetailResponse {
  timestamp: string;
  status: number;
  message: string;
  items: Permission[];
}

