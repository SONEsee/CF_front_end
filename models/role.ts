export interface RoleRequestBody {
  shop_id?: number | null;
  role_name: string;
  description?: string;
}

export interface RolePatchRequest {
  shop_id?: number | null;
  role_name?: string;
  description?: string;
}

export interface Role {
  id: number;
  shop_id: number | null;
  role_name: string;
  description: string;
  created_at: string;
}

// NOTE: total_page/total_items keys are swapped due to a backend bug in
// presenters.ResponseSuccessListData (see models/shop.ts for details).
export interface Pagination {
  current_page: number;
  current_page_total_item: number;
  total_page: number;
  total_items: number;
}

export interface RoleListResponse {
  timestamp: string;
  status: number;
  items: {
    list_data: Role[];
    pagination: Pagination;
  };
}

export interface RoleDetailResponse {
  timestamp: string;
  status: number;
  message: string;
  items: Role[];
}
