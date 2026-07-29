export interface SubscriptionPlanRequestBody {
  plan_name: string;
  price_monthly: number;
  max_users: number;
  max_products: number;
  features?: string;
}

export interface SubscriptionPlanPatchRequest {
  plan_name?: string;
  price_monthly?: number;
  max_users?: number;
  max_products?: number;
  features?: string;
}

export interface SubscriptionPlan {
  id: number;
  plan_name: string;
  price_monthly: number;
  max_users: number;
  max_products: number;
  features: string;
}

export interface Pagination {
  current_page: number;
  current_page_total_item: number;
  total_page: number;
  total_items: number;
}

export interface SubscriptionPlanListResponse {
  timestamp: string;
  status: number;
  items: {
    list_data: SubscriptionPlan[];
    pagination: Pagination;
  };
}

export interface SubscriptionPlanDetailResponse {
  timestamp: string;
  status: number;
  message: string;
  items: SubscriptionPlan[];
}
