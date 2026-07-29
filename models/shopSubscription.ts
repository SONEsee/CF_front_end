export interface ShopSubscriptionRequestBody {
  shop_id: number;
  plan_id: number;
  start_date: string;
  end_date?: string;
}

export interface ShopSubscriptionPatchRequest {
  plan_id?: number;
  end_date?: string;
}

export interface ShopSubscriptionStatusRequest {
  status: "ACTIVE" | "EXPIRED" | "CANCELLED";
}

export interface ShopSubscription {
  id: number;
  shop_id: number;
  plan_id: number;
  start_date: string;
  end_date: string | null;
  status: "ACTIVE" | "EXPIRED" | "CANCELLED";
  created_at: string;
}

export interface Pagination {
  current_page: number;
  current_page_total_item: number;
  total_page: number;
  total_items: number;
}

export interface ShopSubscriptionListResponse {
  timestamp: string;
  status: number;
  items: {
    list_data: ShopSubscription[];
    pagination: Pagination;
  };
}

export interface ShopSubscriptionDetailResponse {
  timestamp: string;
  status: number;
  message: string;
  items: ShopSubscription[];
}
