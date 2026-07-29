export interface CategoryRequestBody {
  shop_id: number;
  parent_id?: number | null;
  name: string;
  sort_order?: number;
}

export interface CategoryPatchRequest {
  parent_id?: number | null;
  name?: string;
  sort_order?: number;
}

export interface Category {
  id: number;
  shop_id: number;
  parent_id: number | null;
  name: string;
  sort_order: number;
}

export interface Pagination {
  current_page: number;
  current_page_total_item: number;
  total_page: number;
  total_items: number;
}

export interface CategoryListResponse {
  timestamp: string;
  status: number;
  items: {
    list_data: Category[];
    pagination: Pagination;
  };
}

export interface CategoryDetailResponse {
  timestamp: string;
  status: number;
  message: string;
  items: Category[];
}

export interface CategoryOption {
  id: number;
  name: string;
}

// /api/v1/product-category/category-options — ບໍ່ມີ pagination, ໃຊ້ສຳລັບ dropdown/autocomplete
export interface CategoryOptionsResponse {
  timestamp: string;
  status: number;
  message: string;
  items: CategoryOption[];
}
