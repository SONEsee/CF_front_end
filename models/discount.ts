export interface DiscountRequestBody {
  shop_id: number;
  code: string;
  discount_type: "PERCENT" | "FIXED";
  discount_value: number;
  min_order?: number;
  usage_limit?: number;
  start_at?: string;
  end_at?: string;
}

export interface DiscountPatchRequest {
  discount_value?: number;
  min_order?: number;
  usage_limit?: number;
  start_at?: string;
  end_at?: string;
}

export interface Discount {
  id: number;
  shop_id: number;
  code: string;
  discount_type: "PERCENT" | "FIXED";
  discount_value: number;
  min_order: number;
  usage_limit: number | null;
  used_count: number;
  start_at: string | null;
  end_at: string | null;
  is_active: boolean;
}

export interface Pagination {
  current_page: number;
  current_page_total_item: number;
  total_page: number;
  total_items: number;
}

export interface DiscountListResponse {
  timestamp: string;
  status: number;
  items: {
    list_data: Discount[];
    pagination: Pagination;
  };
}

export interface DiscountDetailResponse {
  timestamp: string;
  status: number;
  message: string;
  items: Discount[];
}
