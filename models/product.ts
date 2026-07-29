export interface ProductRequestBody {
  shop_id: number;
  category_id?: number | null;
  product_name: string;
  description?: string;
  image_main_url?: string;
}

export interface ProductPatchRequest {
  category_id?: number | null;
  product_name?: string;
  description?: string;
  image_main_url?: string;
  is_active?: boolean;
}

export interface Product {
  id: number;
  shop_id: number;
  category_id: number | null;
  product_name: string;
  description: string;
  image_main_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Pagination {
  current_page: number;
  current_page_total_item: number;
  total_page: number;
  total_items: number;
}

export interface ProductListResponse {
  timestamp: string;
  status: number;
  items: {
    list_data: Product[];
    pagination: Pagination;
  };
}

export interface ProductDetailResponse {
  timestamp: string;
  status: number;
  message: string;
  items: Product[];
}
