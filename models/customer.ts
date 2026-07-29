export interface CustomerRequestBody {
  shop_id: number;
  social_platform_id?: string;
  customer_name?: string;
  profile_pic_url?: string;
  phone_number?: string;
  tags?: string;
  note?: string;
}

export interface CustomerPatchRequest {
  social_platform_id?: string;
  customer_name?: string;
  profile_pic_url?: string;
  phone_number?: string;
  tags?: string;
  note?: string;
}

export interface Customer {
  id: number;
  shop_id: number;
  social_platform_id: string | null;
  customer_name: string | null;
  profile_pic_url: string | null;
  phone_number: string | null;
  default_address_id: number | null;
  tags: string | null;
  note: string | null;
  created_at: string;
  updated_at: string;
}

export interface Pagination {
  current_page: number;
  current_page_total_item: number;
  total_page: number;
  total_items: number;
}

export interface CustomerListResponse {
  timestamp: string;
  status: number;
  items: {
    list_data: Customer[];
    pagination: Pagination;
  };
}

export interface CustomerDetailResponse {
  timestamp: string;
  status: number;
  message: string;
  items: Customer[];
}
