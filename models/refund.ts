export interface RefundRequestBody {
  order_id: number;
  reason?: string;
  refund_amount: number;
}

export interface RefundStatusRequest {
  status: "APPROVED" | "DONE" | "REJECTED";
}

export interface Refund {
  id: number;
  order_id: number;
  reason: string | null;
  refund_amount: number;
  status: "REQUESTED" | "APPROVED" | "DONE" | "REJECTED";
  created_at: string;
}

export interface Pagination {
  current_page: number;
  current_page_total_item: number;
  total_page: number;
  total_items: number;
}

export interface RefundListResponse {
  timestamp: string;
  status: number;
  items: {
    list_data: Refund[];
    pagination: Pagination;
  };
}
