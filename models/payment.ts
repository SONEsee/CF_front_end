export interface PaymentRequestBody {
  order_id: number;
  shop_bank_account_id?: number;
  payment_method: "SLIP" | "PROMPTPAY" | "COD";
  slip_image_path?: string;
  bank_trans_ref_id?: string;
}

export interface PaymentVerifyRequest {
  is_valid_slip: boolean;
  verified_amount?: number;
}

export interface Payment {
  id: number;
  order_id: number;
  shop_bank_account_id: number | null;
  payment_method: "SLIP" | "PROMPTPAY" | "COD";
  slip_image_path: string | null;
  bank_trans_ref_id: string | null;
  verified_amount: number | null;
  is_valid_slip: boolean | null;
  paid_at: string | null;
  created_at: string;
}

export interface Pagination {
  current_page: number;
  current_page_total_item: number;
  total_page: number;
  total_items: number;
}

export interface PaymentListResponse {
  timestamp: string;
  status: number;
  items: {
    list_data: Payment[];
    pagination: Pagination;
  };
}
