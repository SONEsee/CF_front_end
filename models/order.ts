export type OrderStatus =
  | "UNPAID"
  | "PAYMENT_PENDING_VERIFY"
  | "PAID"
  | "PACKING"
  | "SHIPPED"
  | "CANCELLED";

export interface OrderItemInput {
  product_variant_id: number;
  buy_quantity: number;
}

export interface OrderRequestBody {
  shop_id: number;
  customer_id: number;
  live_session_id?: number;
  discount_id?: number;
  shipping_fee?: number;
  note?: string;
  items: OrderItemInput[];
}

export interface OrderStatusRequest {
  status: OrderStatus;
  note?: string;
}

export interface Order {
  id: number;
  shop_id: number;
  customer_id: number;
  live_session_id: number | null;
  discount_id: number | null;
  order_number: string;
  current_status: OrderStatus;
  items_total_amount: number;
  discount_amount: number;
  shipping_fee: number;
  net_payable_amount: number;
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

export interface OrderListResponse {
  timestamp: string;
  status: number;
  items: {
    list_data: Order[];
    pagination: Pagination;
  };
}

export interface OrderDetailResponse {
  timestamp: string;
  status: number;
  message: string;
  items: Order[];
}

export interface OrderCreateResponse {
  timestamp: string;
  status: number;
  message: string;
  items: { order_id: number };
}
