export interface ShipmentRequestBody {
  order_id: number;
  courier_name?: string;
  tracking_number?: string;
  label_pdf_url?: string;
}

export interface ShipmentPatchRequest {
  courier_name?: string;
  tracking_number?: string;
  label_pdf_url?: string;
}

export interface ShipmentStatusRequest {
  status: "PICKED_UP" | "DELIVERED";
}

export interface Shipment {
  id: number;
  order_id: number;
  courier_name: string | null;
  tracking_number: string | null;
  label_pdf_url: string | null;
  shipping_status: string;
  shipped_at: string | null;
  delivered_at: string | null;
}

export interface Pagination {
  current_page: number;
  current_page_total_item: number;
  total_page: number;
  total_items: number;
}

export interface ShipmentListResponse {
  timestamp: string;
  status: number;
  items: {
    list_data: Shipment[];
    pagination: Pagination;
  };
}
