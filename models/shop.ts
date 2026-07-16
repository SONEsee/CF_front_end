export interface ShopRequestBody {
  shop_name: string;
  owner_user_id?: number | null;
  phone?: string;
  timezone?: string;
}

export interface ShopPatchRequest {
  shop_name?: string;
  owner_user_id?: number | null;
  phone?: string;
  timezone?: string;
}

export interface ShopStatusRequest {
  status: "ACTIVE" | "SUSPENDED" | "TRIAL";
}

export interface Shop {
  id: number;
  shop_name: string;
  owner_user_id: number | null;
  phone: string;
  status: string;
  timezone: string;
  created_at: string;
  updated_at: string;
}

// NOTE: go-echo-template's presenters.ResponseSuccessListData has a known bug
// where the "total_page" and "total_items" json keys are swapped: total_page
// actually holds the record count, total_items actually holds the page count.
export interface Pagination {
  current_page: number;
  current_page_total_item: number;
  total_page: number;
  total_items: number;
}

export interface ShopListResponse {
  timestamp: string;
  status: number;
  items: {
    list_data: Shop[];
    pagination: Pagination;
  };
}

// GetDataShopServices returns a plain []ShopDBSchema even for a single id
// lookup without pagination, so the non-paginated response wraps an array.
export interface ShopDetailResponse {
  timestamp: string;
  status: number;
  message: string;
  items: Shop[];
}
