export interface ProductVariantRequestBody {
  product_id: number;
  variant_name: string;
  sku_code: string;
  cf_code?: string;
  barcode?: string;
  price: number;
  cost_price?: number;
  weight_grams?: number;
}

export interface ProductVariantPatchRequest {
  variant_name?: string;
  sku_code?: string;
  cf_code?: string;
  barcode?: string;
  price?: number;
  cost_price?: number;
  weight_grams?: number;
  is_active?: boolean;
}

export interface ProductVariant {
  id: number;
  product_id: number;
  variant_name: string;
  sku_code: string;
  cf_code: string;
  barcode: string;
  price: number;
  cost_price: number;
  weight_grams: number;
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

export interface ProductVariantListResponse {
  timestamp: string;
  status: number;
  items: {
    list_data: ProductVariant[];
    pagination: Pagination;
  };
}

export interface ProductVariantDetailResponse {
  timestamp: string;
  status: number;
  message: string;
  items: ProductVariant[];
}
