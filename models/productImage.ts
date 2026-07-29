export interface ProductImageRequestBody {
  product_id: number;
  image_url: string;
  sort_order?: number;
}

export interface ProductImagePatchRequest {
  image_url?: string;
  sort_order?: number;
}

export interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
  sort_order: number;
}

export interface Pagination {
  current_page: number;
  current_page_total_item: number;
  total_page: number;
  total_items: number;
}

export interface ProductImageListResponse {
  timestamp: string;
  status: number;
  items: {
    list_data: ProductImage[];
    pagination: Pagination;
  };
}

export interface ProductImageDetailResponse {
  timestamp: string;
  status: number;
  message: string;
  items: ProductImage[];
}
