export interface CustomerAddressRequestBody {
  customer_id: number;
  recipient_name?: string;
  phone?: string;
  address?: string;
  sub_district?: string;
  district?: string;
  province?: string;
  postal_code?: string;
}

export interface CustomerAddressPatchRequest {
  recipient_name?: string;
  phone?: string;
  address?: string;
  sub_district?: string;
  district?: string;
  province?: string;
  postal_code?: string;
}

export interface CustomerAddress {
  id: number;
  customer_id: number;
  recipient_name: string | null;
  phone: string | null;
  address: string | null;
  sub_district: string | null;
  district: string | null;
  province: string | null;
  postal_code: string | null;
  is_default: boolean;
}

export interface Pagination {
  current_page: number;
  current_page_total_item: number;
  total_page: number;
  total_items: number;
}

export interface CustomerAddressListResponse {
  timestamp: string;
  status: number;
  items: {
    list_data: CustomerAddress[];
    pagination: Pagination;
  };
}

export interface CustomerAddressDetailResponse {
  timestamp: string;
  status: number;
  message: string;
  items: CustomerAddress[];
}

export interface SetDefaultAddressRequest {
  address_id: number;
}
