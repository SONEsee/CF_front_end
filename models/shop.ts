export interface ShopRequestBody {
  shop_name: string;
  owner_user_id?: number | null;
  phone?: string;
  timezone?: string;
  image_url?: string;
}

export interface ShopPatchRequest {
  shop_name?: string;
  owner_user_id?: number | null;
  phone?: string;
  timezone?: string;
  image_url?: string;
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
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

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

export interface ShopOption {
  id: number;
  shop_name: string;
}

// /api/v1/shop/shop-options — ບໍ່ມີ pagination, ໃຊ້ສຳລັບ dropdown/autocomplete
export interface ShopOptionsResponse {
  timestamp: string;
  status: number;
  message: string;
  items: ShopOption[];
}
