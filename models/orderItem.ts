export interface OrderItem {
  id: number;
  order_id: number;
  product_variant_id: number;
  buy_quantity: number;
  price_snapshot: number;
  subtotal: number;
}

export interface Pagination {
  current_page: number;
  current_page_total_item: number;
  total_page: number;
  total_items: number;
}

export interface OrderItemListResponse {
  timestamp: string;
  status: number;
  items: {
    list_data: OrderItem[];
    pagination: Pagination;
  };
}
